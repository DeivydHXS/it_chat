import { Tabs } from 'expo-router';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#D51917',
        headerShown: true,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Conversas',
          headerTitleAlign: 'center',
          tabBarIcon: () => <Ionicons name="chatbubble" size={24} color={'#687076'} />,
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Grupos',
          headerTitleAlign: 'center',
          tabBarIcon: () => <Ionicons name="chatbubbles" size={24} color={'#687076'} />,
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Amigos',
          headerTitleAlign: 'center',
          tabBarIcon: () => <MaterialIcons name="groups" size={24} color={'#687076'} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          headerTitleAlign: 'center',
          tabBarIcon: () => <MaterialIcons name="person" size={24} color={'#687076'} />,
        }}
      />
    </Tabs>
  );
}
