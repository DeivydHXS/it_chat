import { Colors } from "@/constants/theme";
import { Pressable, PressableProps, StyleSheet, Text, View } from "react-native";

interface CustomPressableProps extends PressableProps {
  text: string
  onPress: () => void
  isAlt?: boolean
}

export function CustomPressable({ text, onPress, disabled, isAlt }: CustomPressableProps) {
  const buttonStyle = disabled
    ? styles.button_container_disabled
    : isAlt
      ? styles.button_container_alt
      : styles.button_container

  const textStyle = isAlt ? styles.button_text_alt : styles.button_text

  return (
    <Pressable disabled={disabled} onPress={onPress} style={buttonStyle}>
      <View style={styles.inside_button_container}>
        <Text style={textStyle}>{text}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button_container: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.dark,
    borderRadius: 30,
  },
  button_container_disabled: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.gray3,
    borderRadius: 30,
  },
  button_container_alt: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.light,
    borderRadius: 30,
  },
  inside_button_container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button_text: {
    color: Colors.light,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button_text_alt: {
    color: Colors.dark,
    textAlign: 'center',
    fontWeight: 'bold',
  },
})
