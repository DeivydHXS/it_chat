import { StyleSheet, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function WellcomeScreen() {
  return (
    <View>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          IT Chat
        </ThemedText>

        <ThemedText type='default' style={styles.text}>
          Venha conhecer o melhor chat do mercado.
          Conecte-se com seus amigos e interaja em grupos.
        </ThemedText>

        <View style={styles.button}>
          <Link href="/info">
            <Link.Trigger>
              <ThemedText style={styles.button}>Começar</ThemedText>
            </Link.Trigger>
          </Link>
        </View>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: '#F8F9FE'
  },
  text: {
    color: '#F8F9FE',
    textAlign: 'center'
  },
  container: {
    backgroundColor: '#D51917',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 8,
  },
  button: {
    padding: 8,
    width: 150,
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: '#F8F9FE',
    fontWeight: 'bold'
  }
});
