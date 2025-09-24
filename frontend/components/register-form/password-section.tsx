import { StyleSheet, Text, View } from "react-native";
import { InfoSection } from "../info-section";
import { CustomInputText } from "../custom-input-text";
import { PasswordCheckSection } from "./password_check";

interface PasswordSectionProps {
    password_value: string | undefined;
    confirmation_value: string | undefined;
    handle_password: (newValue: string) => void;
    handle_confirmation: (newValue: string) => void;
}

export function PasswordSection(props: PasswordSectionProps) {
    const password = props.password_value || "";
    const confirmation = props.confirmation_value || "";

    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasUpperAndLower = /[a-z]/.test(password) && /[A-Z]/.test(password);
    const hasSpecialChar = /[@!&$.*]/.test(password);
    const passwordsMatch = password.length > 0 && password === confirmation;

    return (
        <View style={styles.container}>
            <InfoSection
                head="Crie uma senha"
                body="Crie uma senha com pelo menos 8 caracteres.
Ela deve ser algo que outras pessoas não consiguam advinhar."
            />

            <CustomInputText
                placeholder="Digite sua senha"
                value={password}
                onChangeText={(text) => props.handle_password(text)}
            />
            <CustomInputText
                placeholder="Digite sua senha novamente"
                value={confirmation}
                onChangeText={(text) => props.handle_confirmation(text)}
            />

            <View>
                <PasswordCheckSection text="8 caracteres." checked={hasMinLength} />
                <PasswordCheckSection text="pelo menos um número." checked={hasNumber} />
                <PasswordCheckSection text="uma letra maiúscula e uma minúscula." checked={hasUpperAndLower} />
                <PasswordCheckSection text="pelo menos um caracter especial (@!&$.*)." checked={hasSpecialChar} />
                <PasswordCheckSection text="senhas coincidem." checked={passwordsMatch} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        gap: 16,
    },
});
