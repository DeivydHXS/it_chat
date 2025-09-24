import { StyleSheet, Text, View } from "react-native";
import { InfoSection } from "../info-section";
import { CustomInputText } from "../custom-input-text";


interface ConfirmationSectionProps {
    value: string | undefined
    handle: (newValue: string, field: string) => void
}

export function ConfirmationSection(props: ConfirmationSectionProps) {
    return (
        <View style={styles.container}>
            <InfoSection
                head="Insira o código"
                body="Insira o código de validaçao que foi enviado em
seu endereço de e-mail, para alterar sua senha."
            />

            <CustomInputText placeholder="Digite seu código" value={props.value || ''} onChangeText={(text) => {
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