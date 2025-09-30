import { StyleSheet, View } from "react-native"
import { InfoSection } from "../info-section"
import { CustomInputText } from "../custom-input-text"
import { PasswordCheckSection } from "./password_check"
import { Dispatch, SetStateAction } from "react"

interface PasswordSectionProps {
  password_value: string | undefined
  confirmation_value: string | undefined
  handle_password: (newValue: string) => void
  handle_confirmation: (newValue: string) => void
  canProceed: Dispatch<SetStateAction<boolean>>
}

export function PasswordSection(props: PasswordSectionProps) {
  const password = props.password_value || ""
  const confirmation = props.confirmation_value || ""

  const hasMinLength = password.length >= 8
  const hasNumber = /\d/.test(password)
  const hasUpperAndLower = /[a-z]/.test(password) && /[A-Z]/.test(password)
  const hasSpecialChar = /[@!&$.*]/.test(password)
  const passwordsMatch = password.length > 0 && password === confirmation

  const verifyPassword = (text: string) => {
    props.handle_password(text)

    const checks = [
      text.length >= 8,
      /\d/.test(text),
      /[a-z]/.test(text) && /[A-Z]/.test(text),
      /[@!&$.*]/.test(text),
      text === confirmation && text.length > 0,
    ]

    props.canProceed(!checks.includes(false))
  }

  const verifyConfirmation = (text: string) => {
    props.handle_confirmation(text)

    const checks = [
      hasMinLength,
      hasNumber,
      hasUpperAndLower,
      hasSpecialChar,
      password === text && text.length > 0,
    ]

    props.canProceed(!checks.includes(false))
  }

  return (
    <View style={styles.container}>
      <InfoSection
        head="Crie uma senha"
        body="Crie uma senha com pelo menos 8 caracteres.
Ela deve ser algo que outras pessoas não consigam adivinhar."
      />

      <CustomInputText
        placeholder="Digite sua senha"
        value={password}
        secureTextEntry
        onChangeText={verifyPassword}
      />
      <CustomInputText
        placeholder="Digite sua senha novamente"
        value={confirmation}
        secureTextEntry
        onChangeText={verifyConfirmation}
      />

      <View>
        <PasswordCheckSection text="8 caracteres." checked={hasMinLength} />
        <PasswordCheckSection text="pelo menos um número." checked={hasNumber} />
        <PasswordCheckSection text="uma letra maiúscula e uma minúscula." checked={hasUpperAndLower} />
        <PasswordCheckSection text="pelo menos um caracter especial (@!&$.*)." checked={hasSpecialChar} />
        <PasswordCheckSection text="senhas coincidem." checked={passwordsMatch} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 16,
  },
})
