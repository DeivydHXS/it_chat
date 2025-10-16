import { ChatItem } from '@/components/chat-item'
import { SearchBar } from '@/components/search-bar'
import { mainStyles } from '@/constants/theme'
import { useApi } from '@/hooks/use-api'
import { ChatInterface } from '@/interfaces/chat-interfaces'
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'

export default function ChatsIndex() {
    const { get } = useApi()
    const router = useRouter()

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
                {chats.map((chat, index) => (
                    <ChatItem
                        key={chat.id}
                        user={chat.users[0]}
                        onPress={() => router.push({
                            pathname: `/(chats)/${chat.id}` as any,
                        })}
                    />
                ))}
            </ScrollView>
        </View>
    )
}
