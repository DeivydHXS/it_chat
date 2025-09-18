import { Stack } from 'expo-router';

export default function RootLayout() {

  return (
    <Stack initialRouteName='first'>
      <Stack.Screen name='first' options={{ headerShown: false }} />
      <Stack.Screen name='info' options={{ headerShown: false }} />
      <Stack.Screen name='login' options={{ headerShown: false }} />
    </Stack>
  );
}
