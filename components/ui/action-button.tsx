import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Palette, radius, spacing } from '@/constants/theme';

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function ActionButton({ label, onPress, disabled, variant = 'primary' }: ActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled) }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <ThemedText style={[styles.label, variant !== 'primary' && styles.altLabel]}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    minHeight: 48,
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  secondary: {
    backgroundColor: '#E8F5EE',
    borderColor: '#CFE9D8',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: '#CBD5E1',
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  altLabel: {
    color: '#134E2E',
  },
});
