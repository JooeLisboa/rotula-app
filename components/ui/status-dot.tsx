import { StyleSheet, View } from 'react-native';

interface StatusDotProps {
  color: string;
}

export function StatusDot({ color }: StatusDotProps) {
  return <View style={[styles.dot, { backgroundColor: color }]} />;
}

const styles = StyleSheet.create({
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
});
