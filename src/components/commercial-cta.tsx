import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ActionButton } from '@/components/ui/action-button';
import { Palette, radius, spacing } from '@/constants/theme';

interface CommercialCTAProps {
  title: string;
  description: string;
  buttonLabel: string;
  onPress: () => void;
  variant?: 'solid' | 'outline';
}

export function CommercialCTA({ title, description, buttonLabel, onPress, variant = 'solid' }: CommercialCTAProps) {
  return (
    <View style={[styles.container, variant === 'outline' && styles.outline]}>
      <ThemedText type="defaultSemiBold">{title}</ThemedText>
      <ThemedText style={styles.description}>{description}</ThemedText>
      <ActionButton label={buttonLabel} onPress={onPress} variant={variant === 'solid' ? 'primary' : 'secondary'} accessibilityHint="Abre o próximo passo da análise" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: radius.lg, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surfaceAlt, padding: spacing.md, gap: spacing.sm },
  outline: { backgroundColor: 'transparent' },
  description: { color: Palette.muted, lineHeight: 20 },
});
