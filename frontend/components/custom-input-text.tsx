import { Colors } from "@/constants/theme"
import { useState } from "react"
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native"

interface CustomInputTextProps extends TextInputProps {
  error?: string
  showCounter?: boolean
}

export function CustomInputText(props: CustomInputTextProps) {
  const [length, setLength] = useState(props.value?.length || 0)

  const handleChangeText = (text: string) => {
    setLength(text.length)
    props.onChangeText && props.onChangeText(text)
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={props.error ? styles.input_error : styles.input}
        placeholder={props.placeholder}
        value={props.value}
        onChangeText={handleChangeText}
        keyboardType={props.keyboardType}
        secureTextEntry={props.secureTextEntry}
        maxLength={props.maxLength}
        autoCapitalize="none"
        onFocus={props.onFocus}
      />

      {props.showCounter && props.maxLength && (
        <Text style={styles.counter}>
          {length}/{props.maxLength}
        </Text>
      )}

      {props.error && <Text style={styles.error}>{props.error}</Text>}
    </View>
  )
}

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
    marginBottom: 16
  },
  input: {
    width: "100%",
    height: 50,
    paddingHorizontal: 10,
    borderColor: Colors.gray3,
    borderWidth: 1,
    borderRadius: 10,
    color: Colors.textOnInput,
    fontSize: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  input_error: {
    width: "100%",
    height: 50,
    paddingHorizontal: 10,
    borderColor: Colors.red,
    borderWidth: 1,
    borderRadius: 10,
    color: Colors.red,
    fontSize: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    position: "absolute",
    bottom: -20,
    left: 4,
    color: Colors.red,
    fontSize: 12,
    marginTop: 3,
  },
  counter: {
    position: "absolute",
    left: 12,
    bottom: -6,
    fontSize: 12,
    color: Colors.gray3,
    backgroundColor: Colors.light,
    paddingHorizontal: 3,
  },
})
