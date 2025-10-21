import { Colors } from "@/constants/theme";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

interface CustomInputNumberProps extends TextInputProps {
  error?: string
}

export function CustomInputNumber(props: CustomInputNumberProps) {
  const dontSetIfNAN = useCallback((text: string) => {
    if (Number(text.trim()) || text === '') {
      props.onChangeText ? props.onChangeText(text) : ''
    }
  }, [])

  return (
    <View style={styles.container}>
      <TextInput
        style={props.error ? styles.input_error : styles.input}
        placeholder={props.placeholder}
        value={props.value}
        onChangeText={text => dontSetIfNAN(text)}
        keyboardType='decimal-pad'
        secureTextEntry={props.secureTextEntry}
        maxLength={props.maxLength}
        autoCapitalize="none"
      />
      {props.error && <Text style={styles.error}>{props.error}</Text>}
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
    color: 'red',
    fontSize: 12
  }
});
