import { useRouter } from 'expo-router';
import { type ComponentType, useMemo, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { ActionButton } from '@/components/ui/action-button';
import { SectionCard } from '@/components/ui/section-card';
import { Palette, radius, spacing } from '@/constants/theme';
import { trackEvent } from '@/src/lib/observability/monitoring';

function normalizeBarcode(value: string) {
  return value.replace(/\D/g, '').trim();
}

function getCameraModule(): null | {
  CameraView: ComponentType<Record<string, unknown>>;
  useCameraPermissions: () => [{ granted: boolean } | null, () => Promise<void>];
} {
  try {
    const dynamicRequire = (0, eval)('require') as (name: string) => unknown;
    return dynamicRequire('expo-camera') as {
      CameraView: ComponentType<Record<string, unknown>>;
      useCameraPermissions: () => [{ granted: boolean } | null, () => Promise<void>];
    };
  } catch {
    return null;
  }
}

export default function ScannerScreen() {
  const router = useRouter();
  const cameraModule = getCameraModule();
  const [cameraPermission, requestCameraPermission] = cameraModule?.useCameraPermissions?.() ?? [null, async () => undefined];
  const CameraView = cameraModule?.CameraView;

  const [manualBarcode, setManualBarcode] = useState('');
  const [scanLocked, setScanLocked] = useState(false);
  const lockRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canSubmitManual = useMemo(() => /^\d{8,14}$/.test(normalizeBarcode(manualBarcode)), [manualBarcode]);

  function navigateToProduct(barcode: string, mode: 'camera' | 'manual') {
    if (scanLocked) {
      return;
    }

    setScanLocked(true);
    trackEvent('barcode_scanned', { barcode, mode });
    router.push(`/product/${barcode}`);

    if (lockRef.current) {
      clearTimeout(lockRef.current);
    }

    lockRef.current = setTimeout(() => {
      setScanLocked(false);
    }, 1500);
  }

  return (
    <ScreenShell title="Scanner" subtitle="Aponte a câmera para um código EAN-13 ou use o modo manual.">
      {CameraView && cameraPermission?.granted ? (
        <View style={styles.cameraWrap}>
          <CameraView
            style={styles.camera}
            barcodeScannerSettings={{ barcodeTypes: ['ean13'] }}
            onBarcodeScanned={(result: { data: string }) => {
              const barcode = normalizeBarcode(result.data);
              if (/^\d{13}$/.test(barcode)) {
                navigateToProduct(barcode, 'camera');
              }
            }}
          />
          <View style={styles.overlay}>
            <ThemedText type="defaultSemiBold" style={styles.overlayText}>
              Centralize o código de barras no quadro
            </ThemedText>
          </View>
        </View>
      ) : CameraView ? (
        <SectionCard title="Permissão de câmera" subtitle="Precisamos da câmera para leitura automática do código.">
          <ActionButton label="Permitir câmera" onPress={() => requestCameraPermission()} />
        </SectionCard>
      ) : (
        <SectionCard title="Câmera indisponível" subtitle="Instale o módulo expo-camera para habilitar o scanner automático.">
          <ThemedText>Enquanto isso, você pode usar o modo manual logo abaixo.</ThemedText>
        </SectionCard>
      )}

      <SectionCard title="Fallback manual" subtitle="Se a câmera falhar, digite o código de barras abaixo.">
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={manualBarcode}
          onChangeText={setManualBarcode}
          placeholder="Ex.: 7891000100103"
          accessibilityLabel="Campo para código de barras"
        />
        <ActionButton
          onPress={() => navigateToProduct(normalizeBarcode(manualBarcode), 'manual')}
          disabled={!canSubmitManual || scanLocked}
          label={scanLocked ? 'Aguarde...' : 'Analisar produto'}
        />
      </SectionCard>

      <ThemedText type="caption">Dica: scanner otimizado para EAN-13.</ThemedText>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  cameraWrap: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: '#000',
    height: 320,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  overlayText: {
    color: '#fff',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: '#fff',
    minHeight: 48,
  },
});
