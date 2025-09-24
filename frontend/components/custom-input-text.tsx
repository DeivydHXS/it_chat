import { Colors } from "@/constants/theme";
import { StyleSheet, TextInput } from "react-native";


interface CustomInputTextProps {
    placeholder: string
    value: string
    onChangeText: (text: string) => void
}

export function CustomInputText(props: CustomInputTextProps) {

    return (
        <TextInput
            style={styles.input}
            placeholder={props.placeholder}
            value={props.value}
            onChangeText={props.onChangeText}
        />
    )
}

export const styles = StyleSheet.create({
    input: {
        width: '100%',
        height: 50,
        paddingHorizontal: 10,
        borderColor: Colors.gray3,
        borderWidth: 1,
        borderRadius: 10,
        color: Colors.gray3,
        fontSize: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
})