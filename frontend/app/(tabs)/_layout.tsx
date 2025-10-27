import { Tabs, useSegments } from 'expo-router';

import { Colors } from '@/constants/theme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const segments = useSegments();

  // @ts-ignore
  const hideTabs = segments.includes("[chatId]") || segments.includes("options") || segments.includes("edit");

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.red,
        tabBarInactiveTintColor: Colors.gray2,
        tabBarStyle: hideTabs ? { display: "none" } : {
          backgroundColor: Colors.light
        },
        headerShown: true,
        headerTintColor: Colors.light,
        headerStyle: {
          backgroundColor: Colors.red,
          height: 90
        },
        headerTitleAlign: 'center'
      }}>
      <Tabs.Screen
        name="(chats)"
        options={{
          title: 'Conversas',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="chatbubble" size={24} color={color} />
          ),
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="(groups)"
        options={{
          title: 'Grupos',
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubbles" size={24} color={color} />
          ),
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          href: null,
          title: 'Pesquisa',
          tabBarIcon: ({ color }) => (
            <Ionicons name="search" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Amigos',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="groups" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: 'Perfil',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
