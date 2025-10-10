import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Stack, } from 'expo-router';
import { goBack } from 'expo-router/build/global-state/routing';
import { Text, View } from 'react-native';

export default function ProfileLayout() {
  return (
    <Stack initialRouteName='profile'
      screenOptions={{
        headerShown: true,
        headerTintColor: Colors.light,
        headerStyle: {
          backgroundColor: Colors.red,
        },
        headerTitleAlign: 'center',
        headerLeft: (props: any) => (
          <Ionicons
            name="chevron-back"
            size={24}
            color={Colors.light}
            onPress={() => goBack()}
          />
        )
      }}>
      <Stack.Screen name='profile' options={{
        title: 'Perfil',
        headerLeft: (props: any) => (<View></View>)
      }} />
      <Stack.Screen name='edit' options={{
        title: 'Editar perfil',

      }} />
    </Stack>
  );
}
