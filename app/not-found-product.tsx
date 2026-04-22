import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { ActionButton } from '@/components/ui/action-button';
import { SectionCard } from '@/components/ui/section-card';
import { spacing } from '@/constants/theme';
import { useAuth } from '@/src/hooks/use-auth';
import { captureError } from '@/src/lib/observability/monitoring';
import { submissionService } from '@/src/services/submission/submission-service';

interface PickerResult {
  canceled: boolean;
  assets?: { uri: string }[];
}

interface ImagePickerModule {
  requestCameraPermissionsAsync: () => Promise<{ granted: boolean }>;
  requestMediaLibraryPermissionsAsync: () => Promise<{ granted: boolean }>;
  launchCameraAsync: (input: Record<string, unknown>) => Promise<PickerResult>;
  launchImageLibraryAsync: (input: Record<string, unknown>) => Promise<PickerResult>;
}

function getImagePicker(): ImagePickerModule | null {
  try {
    const dynamicRequire = (0, eval)('require') as (name: string) => unknown;
    return dynamicRequire('expo-image-picker') as ImagePickerModule;
  } catch {
    return null;
  }
}

export default function NotFoundProductScreen() {
  const { barcode } = useLocalSearchParams<{ barcode: string }>();
  const { session } = useAuth();
  const router = useRouter();
  const imagePicker = getImagePicker();
  const [nutritionImageUri, setNutritionImageUri] = useState<string | null>(null);
  const [ingredientsImageUri, setIngredientsImageUri] = useState<string | null>(null);
  const [frontImageUri, setFrontImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  async function pickImage(type: 'nutrition' | 'ingredients' | 'front', source: 'camera' | 'gallery') {
    if (!imagePicker) {
      return;
    }

    const permission =
      source === 'camera'
        ? await imagePicker.requestCameraPermissionsAsync()
        : await imagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result =
      source === 'camera'
        ? await imagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.7, allowsEditing: true })
        : await imagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7, allowsEditing: true });

    if (result.canceled) {
      return;
    }

    const uri = result.assets?.[0]?.uri;
    if (!uri) {
      return;
    }

    if (type === 'nutrition') setNutritionImageUri(uri);
    if (type === 'ingredients') setIngredientsImageUri(uri);
    if (type === 'front') setFrontImageUri(uri);
  }

  async function handleSubmit() {
    if (!session?.user.id || !barcode || !nutritionImageUri || !ingredientsImageUri || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await submissionService.submitProductContribution({
        uid: session.user.id,
        barcode,
        nutritionImageUri,
        ingredientsImageUri,
        frontImageUri: frontImageUri ?? undefined,
        onProgress: setProgress,
      });

      router.replace('/(tabs)');
    } catch (error) {
      captureError(error, { scope: 'screen.notFoundProduct.submit', barcode });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScreenShell title="Produto não encontrado" subtitle="Você pode ajudar enviando fotos do rótulo.">
      {!imagePicker ? (
        <SectionCard title="Upload indisponível" subtitle="Instale expo-image-picker para anexar fotos direto no app.">
          <ThemedText>Você ainda pode testar o restante do fluxo sem envio de imagens.</ThemedText>
        </SectionCard>
      ) : null}
      <SectionCard title="1) Tabela nutricional" subtitle="Foto nítida e completa.">
        <View style={styles.pickerActions}>
          <ActionButton label="Tirar foto" onPress={() => pickImage('nutrition', 'camera')} variant="secondary" />
          <ActionButton label="Escolher da galeria" onPress={() => pickImage('nutrition', 'gallery')} variant="secondary" />
        </View>
        {nutritionImageUri ? <Image source={{ uri: nutritionImageUri }} style={styles.preview} /> : null}
      </SectionCard>

      <SectionCard title="2) Lista de ingredientes" subtitle="Inclua toda a lista, do início ao fim.">
        <View style={styles.pickerActions}>
          <ActionButton label="Tirar foto" onPress={() => pickImage('ingredients', 'camera')} variant="secondary" />
          <ActionButton label="Escolher da galeria" onPress={() => pickImage('ingredients', 'gallery')} variant="secondary" />
        </View>
        {ingredientsImageUri ? <Image source={{ uri: ingredientsImageUri }} style={styles.preview} /> : null}
      </SectionCard>

      <SectionCard title="3) Frente da embalagem (opcional)" subtitle="Ajuda na identificação visual do produto.">
        <View style={styles.pickerActions}>
          <ActionButton label="Tirar foto" onPress={() => pickImage('front', 'camera')} variant="secondary" />
          <ActionButton label="Escolher da galeria" onPress={() => pickImage('front', 'gallery')} variant="secondary" />
        </View>
        {frontImageUri ? <Image source={{ uri: frontImageUri }} style={styles.preview} /> : null}
      </SectionCard>

      <View style={styles.footer}>
        <ThemedText type="caption">Progresso de envio: {Math.round(progress * 100)}%</ThemedText>
        <ActionButton
          label={isSubmitting ? 'Enviando...' : 'Enviar contribuição'}
          onPress={handleSubmit}
          disabled={!nutritionImageUri || !ingredientsImageUri || isSubmitting || !session?.user.id || !imagePicker}
        />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  preview: {
    marginTop: spacing.sm,
    width: '100%',
    height: 160,
    borderRadius: 12,
  },
  footer: {
    gap: spacing.sm,
  },
  pickerActions: {
    gap: spacing.xs,
  },
});
