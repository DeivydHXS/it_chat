import { Colors } from "@/constants/theme";
import { Link, RelativePathString } from "expo-router";
import { Pressable, PressableProps, StyleSheet, Text, View } from "react-native";


interface CustomPressableProps extends PressableProps {
    text: string
    onPress: () => void
}

export function CustomPressable(props: CustomPressableProps) {
    return (
        <Pressable disabled={props.disabled} onPress={props.onPress} style={props.disabled ? styles.button_container_disabled : styles.button_container}>
            <View style={styles.inside_button_container}>
                <Text style={styles.button_text}>{props.text}</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button_container: {
        width: '100%',
        height: 50,
        backgroundColor: Colors.dark,
        borderRadius: 30,
    },
    button_container_disabled: {
        width: '100%',
        height: 50,
        backgroundColor: Colors.gray3,
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