import { Colors } from "@/constants/theme"
import { Ionicons } from "@expo/vector-icons"
import { Stack } from "expo-router"
import { goBack } from "expo-router/build/global-state/routing"

export default function ChatsLayout() {
  return (
    <Stack initialRouteName='index'>
      <Stack.Screen name="index" options={{
        title: 'Conversas',
        headerTitleStyle: { fontWeight: 'condensedBold' },
        headerTitleAlign: 'center',
        headerShown: true,
        headerStyle: { backgroundColor: Colors.red },
        headerTintColor: Colors.light,
      }} />
      <Stack.Screen name="[chatId]" options={{
        title: 'asdsda',
        headerTitleStyle: { fontWeight: 'condensedBold' },
        headerTitleAlign: 'center',
        headerShown: true,
        headerStyle: { backgroundColor: Colors.red },
        headerTintColor: Colors.light,
        headerLeft: (props: any) => (
          <Ionicons
            name="chevron-back"
            size={24}
            color={Colors.light}
            onPress={() => goBack()}
          />
        ),
      }} />
    </Stack>
  )
}
