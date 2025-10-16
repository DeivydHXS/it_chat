import { useLocalSearchParams } from 'expo-router'
import { View, Text } from 'react-native'

export default function ChatScreen() {
    const { chatId } = useLocalSearchParams()

    return (
        <View>
            <Text>Chat ID: {chatId}</Text>
        </View>
    )
}