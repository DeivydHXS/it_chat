import { StyleSheet, Text, View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Link } from 'expo-router';
import icon_img from '../../assets/images/logo-it.png';
import SlideUpCarousel from '@/components/slide-up-carousel';

export default function WellcomeScreen() {
  return (
    <View>
      <LinearGradient
        colors={['#ffd4d3ff', '#cb3f42ff']}
        style={styles.background}
      />
      <View style={styles.container}>
        <View style={styles.content}>
          <Image source={icon_img} style={styles.image} />
          <Text style={styles.title}>
            IT Chat
          </Text>

          <View>
            <Text style={styles.text}>
              Venha conhecer o melhor chat do mercado.
            </Text>
            <Text style={styles.text}>
              Conecte-se com seus amigos e interaja em grupos.
            </Text>
          </View>
        </View>

        <SlideUpCarousel />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  container: {
    backgroundColor: 'transparent',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 16,
  },
  title: {
    color: '#F8F9FE',
    fontSize: 32,
    fontWeight: 'bold'
  },
  text: {
    color: '#F8F9FE',
    textAlign: 'center'
  },
  image: {
    width: 150,
    height: 150
  }
});
