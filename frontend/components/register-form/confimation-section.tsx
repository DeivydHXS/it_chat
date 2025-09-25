import { StyleSheet, View, Alert } from "react-native";
import { InfoSection } from "../info-section";
import { CustomInputText } from "../custom-input-text";


interface ConfirmationSectionProps {
    value?: string
    handle: (newValue: string) => void
}

export function ConfirmationSection(props: ConfirmationSectionProps) {
    return (
        <View style={styles.container}>
            <InfoSection
                head="Insira o código"
                body="Insira o código de validação que foi enviado em seu e-mail."
            />

            <CustomInputText
                placeholder="Digite seu código"
                value={props.value}
                onChangeText={text => props.handle(text)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        gap: 16,
    },
});
