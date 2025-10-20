import { ChatItem } from '@/components/chat-item'
import { SearchBar } from '@/components/search-bar'
import { mainStyles } from '@/constants/theme'
import { useApi } from '@/hooks/use-api'
import { ChatInterface } from '@/interfaces/chat-interfaces'
import { useCallback, useContext, useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'
import { UserInterface } from '@/interfaces/user-interfaces'
import { AuthContext } from '@/context/auth-context'

export default function ChatsIndex() {
    const { user } = useContext(AuthContext)
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

    const excludeUser = (users: UserInterface[]) => {
        return users.filter(u => u.id !== user?.id)[0]
    }

    return (
        <View style={mainStyles.main_container}>
            <SearchBar value={search} onChange={setSearch} />
            <ScrollView style={{
                height: '100%',
                width: '100%'
            }}>
                {chats.map((chat, index) => (
                    <ChatItem
                        key={index}
                        user={excludeUser(chat.users)}
                        onPress={() => router.push({
                            pathname: `/(chats)/${chat.id}` as any,
                            params: {
                                friendJSON: JSON.stringify(excludeUser(chat.users))
                            }
                        })}
                    />
                ))}
            </ScrollView>
        </View>
    )
}
