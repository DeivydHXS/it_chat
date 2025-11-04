import { StyleSheet, Text, View, Image, Animated, Pressable, Alert } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import icon_img from '../../assets/images/logo-it.png'
import { useCallback, useEffect, useRef, useState } from 'react'
import SlideUpCarousel from '@/components/slide-up-carousel'
import { StorageService } from '@/services/storageService'
import { navigate } from 'expo-router/build/global-state/routing'

export default function WellcomeScreen() {
  const translateY = useRef(new Animated.Value(0)).current
  const [first, setFirst] = useState<boolean | null>(null)

  const setStorageFirst = useCallback(async () => {
    await StorageService.setFirst(false)
    setFirst(false)
  }, [])

  const getStorageFirst = useCallback(async () => {
    const res = await StorageService.getFirst()
    setFirst(Boolean(res))
  }, [])

  useEffect(() => {
    getStorageFirst()
  }, [getStorageFirst])

  useEffect(() => {
    if (first === null) return

    if (first) {
      navigate('/login')
    } else {
      setStorageFirst()
    }
  }, [first, setStorageFirst, navigate])

  const active = () => {
    Animated.timing(translateY, {
      toValue: -100,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }

  return (
    <View>
      <LinearGradient
        colors={['#ffd4d3ff', '#cb3f42ff']}
        style={styles.background}
      />
      <View style={styles.container}>
        <View style={styles.content}>
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
  )
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
})
