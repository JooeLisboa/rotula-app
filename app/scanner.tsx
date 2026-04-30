import { useRouter } from 'expo-router';
import { type ComponentType, useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { ActionButton } from '@/components/ui/action-button';
import { SectionCard } from '@/components/ui/section-card';
import { Palette, radius, spacing } from '@/constants/theme';
import { EventName, trackEvent } from '@/src/analytics/events';
import { useLanguage } from '@/src/hooks/use-language';

function normalizeBarcode(value: string) { return value.replace(/\D/g, '').trim(); }
function getCameraModule(): null | { CameraView: ComponentType<Record<string, unknown>>; useCameraPermissions: () => [{ granted: boolean } | null, () => Promise<void>]; } { try { const dynamicRequire = (0, eval)('require') as (name: string) => unknown; return dynamicRequire('expo-camera') as any; } catch { return null; } }

export default function ScannerScreen() {
  const router = useRouter(); const { t } = useLanguage(); const cameraModule = getCameraModule(); const [cameraPermission, requestCameraPermission] = cameraModule?.useCameraPermissions?.() ?? [null, async () => undefined]; const CameraView = cameraModule?.CameraView;
  const [manualBarcode, setManualBarcode] = useState(''); const canSubmitManual = useMemo(() => /^\d{8,14}$/.test(normalizeBarcode(manualBarcode)), [manualBarcode]);
  function navigateToProduct(barcode: string, mode: 'camera' | 'manual') { trackEvent(EventName.ProductScanned, { barcode, mode }); router.push(`/product/${barcode}`); }
  return <ScreenShell title={t('scanner.title')} subtitle={t('scanner.subtitle')}>
    {CameraView && cameraPermission?.granted ? <View style={styles.cameraWrap}><CameraView style={styles.camera} barcodeScannerSettings={{ barcodeTypes: ['ean13'] }} onBarcodeScanned={(result: { data: string }) => { const barcode = normalizeBarcode(result.data); if (/^\d{13}$/.test(barcode)) navigateToProduct(barcode, 'camera'); }} /></View> : <SectionCard title={t('scanner.permissionTitle')} subtitle={t('scanner.permissionSubtitle')}><ActionButton label={t('common.scanNow')} onPress={() => requestCameraPermission()} /></SectionCard>}
    <SectionCard title={t('scanner.manualTitle')} subtitle={t('scanner.manualSubtitle')}><TextInput style={styles.input} keyboardType="number-pad" value={manualBarcode} onChangeText={setManualBarcode} placeholder="Ex.: 7891000100103" /><ActionButton onPress={() => navigateToProduct(normalizeBarcode(manualBarcode), 'manual')} disabled={!canSubmitManual} label={t('common.analyzeProduct')} /></SectionCard>
    <ThemedText type="caption">EAN-13</ThemedText>
  </ScreenShell>;
}
const styles = StyleSheet.create({ cameraWrap: { borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: Palette.border, backgroundColor: '#000', height: 320 }, camera: { flex: 1 }, input: { borderWidth: 1, borderColor: Palette.border, borderRadius: radius.md, padding: spacing.md, backgroundColor: Palette.surface, minHeight: 48, color: Palette.text } });
