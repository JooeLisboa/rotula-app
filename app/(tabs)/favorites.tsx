import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';

export default function FavoritesScreen() {
  return (
    <ScreenShell title="Favoritos" subtitle="Seus produtos salvos para comparar depois.">
      <ThemedText>Estado vazio: você ainda não favoritou produtos.</ThemedText>
    </ScreenShell>
  );
}
