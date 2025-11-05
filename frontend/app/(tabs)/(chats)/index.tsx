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
    try {
      const res = await get<{ data: { chats: ChatInterface[] } }>('/chats')
      if (!res?.data?.data?.chats) {
        console.warn('Resposta inesperada de /chats:', res)
        setChats([])
        return
      }
      setChats(res.data.data.chats)
    } catch (err: any) {
      console.error('Erro ao buscar chats:', err?.response?.data || err)
      setChats([])
    }
  }, [get])

  useEffect(() => {
    if (!user?.id) return
    if (pathname === '/') {
      getChats()
    }
  }, [pathname, getChats])

  useEffect(() => {
    if (!user?.id) return

    const socket = SocketService.getInstance(user.id)
    socket.connect()

    // ⚡ Atualizar última mensagem recebida
    const handleNewMessage = (message: any) => {
      setChats((prevChats) => {
        const updated = [...prevChats]
        const chatIndex = updated.findIndex((c) => c.id === message.chat_id)

        if (chatIndex !== -1) {
          const chat = updated[chatIndex]
          updated[chatIndex] = {
            ...chat,
            last_message: message,
            unread_count:
              message.user_id !== user.id
                ? (chat.unread_count || 0) + 1
                : chat.unread_count,
          }

          // mover o chat pro topo
          const [newTop] = updated.splice(chatIndex, 1)
          return [newTop, ...updated]
        }

        return prevChats
      })
    }

    // 🟡 Atualizar contador de mensagens não lidas
    const handleUnreadUpdate = ({ chatId, total }: { chatId: string; total: number }) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId ? { ...chat, unread_count: total } : chat
        )
      )
    }

    // Registrar listeners
    socket.onMessage(handleNewMessage)
    socket.onMessagesUnreadUpdate(handleUnreadUpdate)

    return () => {
      socket.offMessage(handleNewMessage)
      socket.offMessagesUnreadUpdate(handleUnreadUpdate)
      socket.disconnect()
    }
  }, [user?.id])

  const excludeUser = (users: UserInterface[]) => {
    return users.filter((u) => u.id !== user?.id)[0]
  }

  const doSearch = useCallback(async () => {
    const res = await get<{ data: { chats: ChatInterface[] } }>('/chats', { search })
    setChats(res.data.data.chats)
  }, [search, get])

  return (
    <View style={mainStyles.main_container}>
      <SearchBar
        value={search}
        onChange={(text) => {
          setSearch(text)
          doSearch()
        }}
        cleanFunction={getChats}
      />

      {chats.length <= 0 ? (
        <Text>Você não tem nenhuma conversa ainda.</Text>
      ) : (
        <ScrollView style={{ height: '100%', width: '100%' }}>
          {chats.map((chat, index) => (
            <ChatItem
              key={index}
              chatId={chat.id}
              unread_count={chat.unread_count}
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
      )}
    </View>
  )
}
