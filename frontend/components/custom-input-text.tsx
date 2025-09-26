import { Colors } from "@/constants/theme";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

interface CustomInputTextProps extends TextInputProps {
  error?: string
}

export function CustomInputText(props: CustomInputTextProps) {
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    setError(props.error)
  }, [props.error])

  const clearError = useCallback((text: string) => {
    setError(undefined)
    if (props.onChangeText) props.onChangeText(text)
  }, [])

  return (
    <View style={styles.container}>
      <TextInput
        style={error ? styles.input_error : styles.input}
        placeholder={props.placeholder}
        value={props.value}
        onChangeText={error ? (text) => clearError(text) : props.onChangeText}
        keyboardType={props.keyboardType}
        secureTextEntry={props.secureTextEntry}
        maxLength={props.maxLength}
      />
      { error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

export const styles = StyleSheet.create({

  container: {
    width: "100%",
  },
  input: {
    width: "100%",
    height: 50,
    paddingHorizontal: 10,
    borderColor: Colors.gray3,
    borderWidth: 1,
    borderRadius: 10,
    color: Colors.gray3,
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
    color: 'red',
    fontSize: 12
  }
});
