import { Link } from 'expo-router'
import React, { useRef, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const { width } = Dimensions.get('window')

const DATA = [
  {
    key: '1',
    text: `Seja bem-vindo ao IT Chat!

Aqui você poderá conversar
com seus amigos.

Criar e entrar em grupos de conversa.`,
  },
  { key: '2', text: `Descubra grupos interessantes.

Faça novos amigos.

Se divirta.` },
  { key: '3', text: 'Faça login ou crie uma conta grátis.' },
]

const WellcomeCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width)
    setCurrentIndex(index)
  }

  const goToSlide = (index: number) => {
    if (index >= 0 && index < DATA.length) {
      flatListRef.current?.scrollToIndex({ index, animated: true })
      // setCurrentIndex(index)
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={DATA}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View
              style={{
                height: '70%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={styles.text}>{item.text}</Text>
            </View>
            {item.key === '3' && (
              <Link href="/login" style={styles.button_container}>
                <Link.Trigger>
                  <Text
                    style={{
                      color: '#F8F9FE',
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}
                  >
                    Finalizar
                  </Text>
                </Link.Trigger>
              </Link>
            )}
          </View>
        )}
        keyExtractor={(item) => item.key}
      />

      <Pressable
        style={[styles.arrow, { left: 10 }]}
        disabled={currentIndex === 0}
        onPress={() => goToSlide(currentIndex - 1)}
      >
        <Ionicons
          name="chevron-back"
          size={32}
          color={currentIndex === 0 ? '#aaa' : '#1F2024'}
        />
      </Pressable>

      <Pressable
        style={[styles.arrow, { right: 10 }]}
        disabled={currentIndex === DATA.length - 1}
        onPress={() => goToSlide(currentIndex + 1)}
      >
        <Ionicons
          name="chevron-forward"
          size={32}
          color={currentIndex === DATA.length - 1 ? '#aaa' : '#1F2024'}
        />
      </Pressable>

      <View style={styles.dotsContainer}>
        {DATA.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              currentIndex === idx && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    width,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 24,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    color: '#333',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#cb3f42ff',
  },
  button_container: {
    width: 150,
    height: 40,
    alignItems: 'center',
    backgroundColor: '#1F2024',
    padding: 8,
    borderRadius: 30,
  },
  arrow: {
    position: 'absolute',
    top: '45%',
    padding: 10,
    zIndex: 1,
  },
})

export default WellcomeCarousel
