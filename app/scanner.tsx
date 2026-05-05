import { useFocusEffect, useRouter } from 'expo-router';
import { type ComponentType, useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { ActionButton } from '@/components/ui/action-button';
import { ErrorState } from '@/components/ui/error-state';
import { SectionCard } from '@/components/ui/section-card';
import { Palette, radius, spacing } from '@/constants/theme';
import { EventName, trackEvent } from '@/src/analytics/events';
import { useLanguage } from '@/src/hooks/use-language';

function normalizeBarcode(value: string) { return value.replace(/\D/g, '').trim(); }
function getCameraModule(): null | { CameraView: ComponentType<Record<string, unknown>>; useCameraPermissions: () => [{ granted: boolean } | null, () => Promise<void>]; } { try { const dynamicRequire = (0, eval)('require') as (name: string) => unknown; return dynamicRequire('expo-camera') as any; } catch { return null; } }

export default function ScannerScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const cameraModule = getCameraModule();
  const [cameraPermission, requestCameraPermission] = cameraModule?.useCameraPermissions?.() ?? [null, async () => undefined];
  const CameraView = cameraModule?.CameraView;
  const [manualBarcode, setManualBarcode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const lastScanRef = useRef<{ barcode: string; at: number } | null>(null);
  const canSubmitManual = useMemo(() => /^\d{8,14}$/.test(normalizeBarcode(manualBarcode)), [manualBarcode]);

  useFocusEffect(useCallback(() => {
    setIsProcessing(false);
    setScanError(null);
    lastScanRef.current = null;
  }, []));

  function canProcessBarcode(barcode: string) {
    if (isProcessing) return false;
    const now = Date.now();
    if (lastScanRef.current?.barcode === barcode && now - lastScanRef.current.at < 3000) return false;
    lastScanRef.current = { barcode, at: now };
    return true;
  }

  function navigateToProduct(barcode: string, mode: 'camera' | 'manual') {
    if (!canProcessBarcode(barcode)) return;
    setIsProcessing(true);
    setScanError(null);
    trackEvent(EventName.ProductScanned, { mode });
    router.push(`/product/${barcode}`);
  }

  const handleManualSubmit = () => {
    const barcode = normalizeBarcode(manualBarcode);
    if (!/^\d{8,14}$/.test(barcode)) {
      setScanError(t('scanner.invalidBarcode'));
      return;
    }
    navigateToProduct(barcode, 'manual');
  };

  return <ScreenShell title={t('scanner.title')} subtitle={t('scanner.subtitle')}>
    {CameraView && cameraPermission?.granted ? <View style={styles.cameraWrap}><CameraView style={styles.camera} barcodeScannerSettings={{ barcodeTypes: ['ean13'] }} onBarcodeScanned={(result: { data: string }) => { const barcode = normalizeBarcode(result.data); if (/^\d{13}$/.test(barcode)) navigateToProduct(barcode, 'camera'); }} /></View> : <SectionCard title={t('scanner.permissionTitle')} subtitle={t('scanner.permissionSubtitle')}><ActionButton label={t('common.scanNow')} onPress={() => requestCameraPermission()} disabled={isProcessing} /></SectionCard>}
    <SectionCard title={t('scanner.manualTitle')} subtitle={t('scanner.manualSubtitle')}><TextInput style={styles.input} keyboardType="number-pad" value={manualBarcode} onChangeText={setManualBarcode} placeholder={t('scanner.manualPlaceholder')} /><ActionButton onPress={handleManualSubmit} disabled={!canSubmitManual || isProcessing} label={isProcessing ? t('scanner.processing') : t('common.analyzeProduct')} /></SectionCard>
    {isProcessing ? <ThemedText type="caption">{t('scanner.processing')}</ThemedText> : <ThemedText type="caption">{t('scanner.waiting')}</ThemedText>}
    {scanError ? <ErrorState title={t('common.error')} description={scanError} /> : null}
    <ActionButton label={t('scanner.tryAgain')} onPress={() => { setIsProcessing(false); setScanError(null); lastScanRef.current = null; }} variant="secondary" />
  </ScreenShell>;
}
const styles = StyleSheet.create({ cameraWrap: { borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: Palette.border, backgroundColor: '#000', height: 320 }, camera: { flex: 1 }, input: { borderWidth: 1, borderColor: Palette.border, borderRadius: radius.md, padding: spacing.md, backgroundColor: Palette.surface, minHeight: 48, color: Palette.text } });
