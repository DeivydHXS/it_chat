import { SearchBar } from '@/components/search-bar';
import { Colors, mainStyles } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { ChatInterface } from '@/interfaces/chat-interfaces';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function TabOneScreen() {
  const { get } = useApi()

  const [search, setSearch] = useState('')
  const [chats, setChats] = useState<ChatInterface[]>([])

  const getChats = useCallback(async () => {
    const res = await get<{ data: { chats: ChatInterface[] } }>('/chats')
    setChats(res.data.data.chats)
  }, [])

  useEffect(() => {
    getChats()
  }, [])

  return (
    <View style={mainStyles.main_container}>
      <SearchBar value={search} onChange={setSearch} />
      <ScrollView>
        {chats.map(chat => (
          <View>
            <Text>{chat.users[0].name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({

})