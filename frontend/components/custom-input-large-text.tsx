import { Colors } from '@/constants/theme'
import { useCallback, useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native'

interface CustomInputLargeTextProps extends TextInputProps {
  error?: string
  showCounter?: boolean
}

export function CustomInputLargeText(props: CustomInputLargeTextProps) {
  const [length, setLength] = useState(props.value?.length || 0)

  const handleChangeText = (text: string) => {
    setLength(text.length)
    props.onChangeText && props.onChangeText(text)
  }

  useEffect(() => {
    handleChangeText(props.value || '')
  }, [props.value])

  return (
    <View style={styles.container}>
      <TextInput
        multiline
        style={props.error ? styles.input_error : styles.input}
        placeholder={props.placeholder}
        value={props.value}
        onChangeText={handleChangeText}
        keyboardType={props.keyboardType}
        secureTextEntry={props.secureTextEntry}
        maxLength={props.maxLength}
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
    width: '100%',
  },
  input: {
    width: '100%',
    height: 180,
    paddingHorizontal: 10,
    borderColor: Colors.gray3,
    borderWidth: 1,
    borderRadius: 10,
    color: Colors.textOnInput,
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
    textAlignVertical: 'top'
  },
  input_error: {
    width: '100%',
    height: 180,
    paddingHorizontal: 10,
    borderColor: Colors.red,
    borderWidth: 1,
    borderRadius: 10,
    color: Colors.red,
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
    textAlignVertical: 'top',

  },
  error: {
    color: 'red',
    fontSize: 12
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
