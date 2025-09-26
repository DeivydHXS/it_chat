import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useNavigation } from 'expo-router';
import { goBack, navigate } from 'expo-router/build/global-state/routing';

export default function WellcomeLayout() {
  return (
    <Stack initialRouteName='login'>  
      <Stack.Screen name='first' options={{ headerShown: false }} />
      <Stack.Screen name='login' options={{ headerShown: false }} />
      <Stack.Screen name='register' options={{
        title: 'Registro',
        headerTitleStyle: { fontWeight: 'condensedBold' },
        headerTitleAlign: 'center',
        headerShown: true,
        headerStyle: { backgroundColor: Colors.red },
        headerTintColor: Colors.light,
        headerLeft: (props:any ) => (
          <Ionicons
            name="chevron-back"
            size={32}
            color={ Colors.light }
            onPress={() => goBack()}
          />
        ),
      }} />
    </Stack>
  );
}
