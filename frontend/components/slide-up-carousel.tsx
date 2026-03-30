import React, { useRef, useEffect } from 'react'
import { Animated, StyleSheet, View, Button, Pressable, Text } from 'react-native'
import WellcomeCarousel from './wellcome-carousel'

interface SlideProps {
  handleAtive: () => void
}

const SlideUpCarousel = (props: SlideProps) => {
  const translateY = useRef(new Animated.Value(550)).current

  const slideUp = () => {
    props.handleAtive()
    Animated.timing(translateY, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={slideUp} style={styles.button_container}>
        <Text style={styles.button_text}>Começar</Text>
      </Pressable>
      <Animated.View
        style={[
          styles.box,
          { transform: [{ translateY }] },
        ]}
      >
        <WellcomeCarousel />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: '100%',
    height: 550,
    backgroundColor: '#F8F9FE',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  button_container: {
    marginBottom: 150,
    width: 150,
    height: 40,
    alignItems: 'center',
    backgroundColor: '#F8F9FE',
    padding: 8,
    borderRadius: 30,
  },
  button_text: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
})

export default SlideUpCarousel
