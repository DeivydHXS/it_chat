import { ChatItem } from '@/components/chat-item'
import { SearchBar } from '@/components/search-bar'
import { mainStyles } from '@/constants/theme'
import { useApi } from '@/hooks/use-api'
import { ChatInterface } from '@/interfaces/chat-interfaces'
import { useCallback, useContext, useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { usePathname, useRouter } from 'expo-router'
import { UserInterface } from '@/interfaces/user-interfaces'
import { AuthContext } from '@/context/auth-context'
import SocketService from '@/services/socket'

export default function ChatsIndex() {
  const { user } = useContext(AuthContext)
  const { get } = useApi()
  const router = useRouter()

  const [search, setSearch] = useState('')
  const [chats, setChats] = useState<ChatInterface[]>([])
  const pathname = usePathname()

  const getChats = useCallback(async () => {
    const res = await get<{ data: { chats: ChatInterface[] } }>('/chats')
    setChats(res.data.data.chats)
  }, [])

  useEffect(() => {
    if (pathname === '/') {
      getChats()
    }
  }, [pathname])

  useEffect(() => {
    if (!user?.id) return

    const socket = SocketService.getInstance(user.id)
    socket.connect()

    const handleNewMessage = (message: any) => {
      setChats((prevChats) => {
        const updated = [...prevChats]
        const chatIndex = updated.findIndex((c) => c.id === message.chat_id)

        if (chatIndex !== -1) {
          updated[chatIndex] = {
            ...updated[chatIndex],
            last_message: message,
          }

          const [chat] = updated.splice(chatIndex, 1)
          return [chat, ...updated]
        }

        return prevChats
      })
    }

    socket.onMessage(handleNewMessage)

    return () => {
      socket.offMessage(handleNewMessage)
      socket.disconnect()
    }
  }, [user?.id])

  const excludeUser = (users: UserInterface[]) => {
    return users.filter((u) => u.id !== user?.id)[0]
  }

  return (
    <View style={mainStyles.main_container}>
      <SearchBar value={search} onChange={setSearch} />
      { chats.length <= 0 ?
          <Text>Você não tem nenhuma conversa ainda.</Text> :
          <ScrollView style={{ height: '100%', width: '100%' }}>
            {chats.map((chat, index) => (
              <ChatItem
                key={index}
                user={excludeUser(chat.users)}
                lastMessage={chat.last_message}
                onPress={() =>
                  router.push({
                    pathname: `/(chats)/${chat.id}` as any,
                    params: {
                      friendJSON: JSON.stringify(excludeUser(chat.users)),
                    },
                  })
                }
              />
            ))}
          </ScrollView>
      }
    </View>
  )
}
