import { StyleSheet, Text, View } from "react-native";
import { InfoSection } from "../info-section";
import { CustomInputText } from "../custom-input-text";


interface EmailSectionProps {
    value: string | undefined
    handle: (newValue: string, field: string) => void
}

export function EmailSection(props: EmailSectionProps) {
    return (
        <View style={styles.container}>
            <InfoSection
                head="Qual é o seu endereço de e-mail?"
                body="Insira um endereço de email válido.
Ninguém verá essa informação no seu perfil."
            />

            <CustomInputText placeholder="Digite seu email" value={props.value || ''} onChangeText={(text) => {
                props.handle(text, 'email')
            }} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 16
    }
})