import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function WellcomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D51917', dark: '#D51917' }}
      >
      <ThemedView style={styles.stepContainer}>

        <Link href="/(tabs)">
          <Link.Trigger>
            <ThemedText type="subtitle">Login</ThemedText>
          </Link.Trigger>
        </Link>

      </ThemedView>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
