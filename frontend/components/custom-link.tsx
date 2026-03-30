import { Colors } from "@/constants/theme"
import { Link, RelativePathString } from "expo-router"
import { StyleSheet, Text, View } from "react-native"


interface CustomLinkProps {
    text: string
    to: string
    isAlt: boolean
}

export function CustomLink(props: CustomLinkProps) {
    return (
        <Link href={props.to as RelativePathString} style={props.isAlt ? styles.button_container_alt : styles.button_container}>
            <Link.Trigger>
                <View style={styles.inside_button_container}>
                    <Text style={props.isAlt ? styles.button_text_alt : styles.button_text}>{props.text}</Text>
                </View>
            </Link.Trigger>
        </Link>
    )
}

const styles = StyleSheet.create({
    button_container: {
        width: '100%',
        height: 50,
        backgroundColor: Colors.dark,
        borderRadius: 30,
    },
    button_container_alt: {
        width: '100%',
        height: 50,
        backgroundColor: Colors.light,
        borderRadius: 30,
    },
    inside_button_container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button_text: {
        color: Colors.light,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    button_text_alt: {
        color: Colors.dark,
        textAlign: 'center',
        fontWeight: 'bold'
    }
})