import { Colors } from '@/constants/theme';
import { TokenInterface } from '@/interfaces/user-interfaces';
import { StorageService } from '@/services/storageService';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { goBack, navigate } from 'expo-router/build/global-state/routing';
import { useCallback, useEffect, useState } from 'react';

export default function WellcomeLayout() {
  const [alreadyVisit, setAlreadyVisit] = useState<TokenInterface | null>()

  const getToken = useCallback(async () => {
    const res = await StorageService.getToken()
    setAlreadyVisit(res)
  }, [])

  useEffect(() => {
    getToken()
  }, [])

  useEffect(() => {
    if (alreadyVisit) {
      navigate('/(tabs)')
    }
  }, [alreadyVisit])

  return (
    <Stack initialRouteName='first'>
      <Stack.Screen name='first' options={{ headerShown: false }} />
      <Stack.Screen name='login' options={{ headerShown: false }} />
      <Stack.Screen name='register' options={{
        title: 'Registro',
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
      <Stack.Screen name='forgot-password' options={{
        title: 'Esqueceu a senha',
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
  );
}
