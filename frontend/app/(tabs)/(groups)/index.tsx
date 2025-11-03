import { GroupsItem } from '@/components/groups-item';
import { SearchBar } from '@/components/search-bar';
import { Colors, mainStyles } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { ChatInterface } from '@/interfaces/chat-interfaces';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { navigate } from 'expo-router/build/global-state/routing';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function GroupsScreen() {
  const { get } = useApi()
  const router = useRouter()

  const [search, setSearch] = useState('')
  const [groups, setGroups] = useState<ChatInterface[]>([])
  const baseURL = process.env.EXPO_PUBLIC_API_URL

  const getGroups = useCallback(async () => {
    const res = await get<{ data: { groups: ChatInterface[] } }>('/groups')
    setGroups(res.data.data.groups)
  }, [])

  useEffect(() => {
    getGroups()
  }, [])

  return (
    <View style={mainStyles.main_container}>
      <SearchBar value={search} onChange={setSearch} />

      {groups.length <= 0 ?
        <Text>Você não faz parte de nenhum grupo ainda.</Text> :
        <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          width: '100%',
        }}>
        {groups.map((group, index) => (
          <GroupsItem
            key={index}
            title={group.name || ''}
            description={group.description || ''}
            icon_image_url={group.icon_image_url ? String(baseURL) + group.icon_image_url : undefined}
            cover_image_url={group.cover_image_url ? String(baseURL) + group.cover_image_url : undefined}
            onPress={() => {
              router.push({
                pathname: `/(groups)/${group.id}` as any
              })
            }
            }
          />
        ))}

      </ScrollView>}

      <View
        style={{
          position: 'absolute',
          right: 16,
          bottom: 16,
          borderRadius: 100,
          backgroundColor: Colors.red,
          width: 48,
          height: 48,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Pressable
          onPress={() => {
            navigate('/create')
          }}
        >
          <Ionicons name="add" size={32} color={Colors.light} />
        </Pressable>
      </View>
    </View>
  );
}
