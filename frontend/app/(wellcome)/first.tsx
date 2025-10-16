import { StyleSheet, Text, View, Image, Animated, Pressable, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import icon_img from '../../assets/images/logo-it.png';
import { useCallback, useContext, useRef, useState } from 'react';
import SlideUpCarousel from '@/components/slide-up-carousel';
import { LoginInterface } from '@/interfaces/common-interfaces';
import { useApi } from '@/hooks/use-api';
import { AuthContext } from '@/context/auth-context';
import { router } from 'expo-router';

export default function WellcomeScreen() {
  const [ative, setAtive] = useState<boolean>(false)
  const translateY = useRef(new Animated.Value(0)).current;
  const { post } = useApi()
  const { login } = useContext(AuthContext)
  
  const active = () => {
    setAtive(true)
    Animated.timing(translateY, {
      toValue: -100,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleLogin = useCallback(async () => {
    try {
      const response = await post<LoginInterface>('/auth/login', { email: 'superdev@email.com', password: 'SuperDEV1@' });
      // @ts-ignore
      await login(response.data.data?.user, response.data.data?.token);
      router.replace('/(tabs)')
    } catch (err) {
      Alert.alert('Erro', JSON.stringify(err));
    }
  }, [])

  const handleLoginTest = useCallback(async () => {
    try {
      const response = await post<LoginInterface>('/auth/login', { email: 'superqa@email.com', password: 'SuperQA1@' });

      // @ts-ignore
      await login(response.data.data?.user, response.data.data?.token);
      router.replace('/(tabs)')
    } catch (err) {
      Alert.alert('Erro', JSON.stringify(err));
    }
  }, [])

  return (
    <View>
      <LinearGradient
        colors={['#ffd4d3ff', '#cb3f42ff']}
        style={styles.background}
      />
      <View style={styles.container}>
        <View style={styles.content}>
          <Pressable onPress={handleLogin}>
            <Text>DEV</Text>
          </Pressable>
          <Pressable onPress={handleLoginTest}>
            <Text>TEST</Text>
          </Pressable>

          <Animated.View
            style={[
              { transform: [{ translateY }] },
            ]}>
            <Image source={icon_img} style={styles.image} />
          </Animated.View>
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

        <SlideUpCarousel handleAtive={active} />
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
    width: 200,
    height: 200
  }
});
