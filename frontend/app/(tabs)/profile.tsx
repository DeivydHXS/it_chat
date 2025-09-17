import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';

export default function TabFourScreen() {
  return (
    <ThemedView style={styles.main}>
      <ThemedText>Deivyd</ThemedText>
      <ThemedText>dehox#01AC</ThemedText>
      <ThemedText>Melhor bio de todas.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    gap: 8,
  },
});
