import { StyleSheet, Text, View } from "react-native";
import { InfoSection } from "../info-section";
import { CustomInputText } from "../custom-input-text";


interface NicknameSectionProps {
    value: string | undefined
    handle: (newValue: string) => void
}

export function NicknameSection(props: NicknameSectionProps) {
    return (
        <View style={styles.container}>
            <InfoSection
                head="Escolha um nome de usuário"
                body="Escolha um apelido único para sua conta."
            />

            <CustomInputText placeholder="Digite um nome de usuário" value={props.value} onChangeText={(text) => {
                props.handle(text)
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