import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Palette, radius, spacing } from '@/constants/theme';
import { featureFlags } from '@/src/config/feature-flags';
import { useLanguage } from '@/src/hooks/use-language';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  if (!featureFlags.enableEnglishLanguage) {
    return null;
  }

  return (
    <View style={styles.container} accessibilityLabel="Seletor de idioma">
      {(['pt', 'en'] as const).map((item) => {
        const active = language === item;
        return (
          <Pressable
            key={item}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Mudar idioma para ${item.toUpperCase()}`}
            onPress={() => setLanguage(item)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <ThemedText style={[styles.label, active && styles.labelActive]}>{item.toUpperCase()}</ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: spacing.xs, alignSelf: 'flex-end' },
  chip: { borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surface, borderRadius: radius.pill, paddingVertical: 6, paddingHorizontal: 10 },
  chipActive: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  label: { fontSize: 12, fontWeight: '600' },
  labelActive: { color: '#fff' },
});
