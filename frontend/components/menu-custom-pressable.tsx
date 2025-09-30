import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Link, RelativePathString } from "expo-router";
import { Pressable, PressableProps, StyleSheet, Text, View } from "react-native";


interface MenuCustomPressableProps extends PressableProps {
    text: string
    onPress: () => void
}

export function MenuCustomPressable(props: MenuCustomPressableProps) {
    return (
        <Pressable style={styles.container}>
            <Text>{props.text}</Text>
            <Ionicons
                name="chevron-forward"
                size={18}
                color={Colors.red}
            />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})