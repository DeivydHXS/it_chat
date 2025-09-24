import { StyleSheet, Text, View } from "react-native";
import { InfoSection } from "../info-section";
import { CustomInputText } from "../custom-input-text";


interface NameSectionProps {
    value: string | undefined
    handle: (newValue: string, field: string) => void
}

export function NameSection(props: NameSectionProps) {
    return (
        <View style={styles.container}>
            <InfoSection
                head="Qual é o seu nome?"
                body="Insira um nome para seus amigos te encontrarem."
            />

            <CustomInputText placeholder="Digite seu nome" value={props.value || ''} onChangeText={(text) => {
                props.handle(text, 'name')
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