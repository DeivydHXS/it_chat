import { Colors } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";


interface InfoSectionProps {
    head: string
    body: string
}

export function InfoSection(props: InfoSectionProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.head}>{props.head}</Text>
            <Text style={styles.body}>{props.body}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 8
    },
    head: {
        fontSize: 22,
        color: Colors.dark,
        fontWeight: 'bold'
    },
    body: {
        fontSize: 16,
        color: Colors.gray1,
        fontWeight: '400'
    }
})