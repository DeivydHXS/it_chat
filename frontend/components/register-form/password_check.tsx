import { Colors } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PasswordCheckSectionProps {
    text: string | undefined
    checked: boolean
}

export function PasswordCheckSection(props: PasswordCheckSectionProps) {
    return (
        <View style={styles.container}>
            {
            props.checked ? 
            <Ionicons name="checkmark-circle-sharp" size={24} color={Colors.check} />
            :
            <Ionicons name="close-circle" size={24} color={Colors.gray3} />
            }
            <Text>{props.text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    }
})