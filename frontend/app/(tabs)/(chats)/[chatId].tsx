import { MessageItem } from '@/components/message-item'
import { Colors, mainStyles } from '@/constants/theme'
import { AuthContext } from '@/context/auth-context'
import { useApi } from '@/hooks/use-api'
import { ChatInterface, MessageInterface } from '@/interfaces/chat-interfaces'
import { ResponseInterface } from '@/interfaces/common-interfaces'
import { UserInterface } from '@/interfaces/user-interfaces'
import SocketService from '@/services/socket'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  TextInput,
  Keyboard,
  Animated,
  Easing,
  Platform,
  Alert,
  FlatList,
} from 'react-native'

export default function ChatScreen() {
  const { user } = useContext(AuthContext)
  const baseURL = process.env.EXPO_PUBLIC_API_URL
  const { get, post, del } = useApi()
  const { chatId, friendJSON } = useLocalSearchParams()
  const translateY = useRef(new Animated.Value(0)).current
  const [inputValue, setInputValue] = useState('')
  const scrollViewRef = useRef<ScrollView>(null)
  const router = useRouter()
  const flatListRef = useRef<FlatList>(null)

  const [friend, setFriend] = useState<UserInterface>()
  const [chat, setChat] = useState<ChatInterface>()
  const [messages, setMessages] = useState<MessageInterface[]>()
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  const socket = SocketService.getInstance(user?.id || '')

  const getChat = useCallback(async () => {
    const res = await get<{ data: { chat: ChatInterface } }>(`/chats/${chatId}`)
    setChat(res.data.data.chat)
  }, [])

  const loadMessages = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)

    try {
      const res = await get<{
        data: {
          data: MessageInterface[],
          meta: {
            total: number,
            per_page: number,
            current_page: number,
            last_page: number
          }
        }
      }>(`/messages/${chatId}?page=${page}&limit=10`)

      if (!res || !res.data || !res.data.data) {
        console.warn('Resposta inesperada da API:', res)
        return
      }

      const data = res.data.data.data
      const meta = res.data.data.meta

      if (data.length === 0 || meta.current_page >= meta.last_page) {
        setHasMore(false)
        return
      }

      setMessages(prev => {
        const existingIds = new Set(prev?.map(m => m.id))
        const unique = data.filter(m => !existingIds.has(m.id))
        return prev ? [...prev, ...unique] : unique
      })
      setPage(prev => prev + 1)

    } catch (err: any) {
      console.error('Erro ao carregar mensagens', err?.response?.data || err)
    } finally {
      setLoading(false)
    }
  }, [chatId, page, hasMore, loading])

  const markAsRead = useCallback(async () => {
    try {
      if (!chatId) return
      await post(`/chats/${chatId}/read`)
    } catch (err) {
      console.warn('Erro ao marcar mensagens como lidas', err)
    }
  }, [chatId])

  useFocusEffect(
    useCallback(() => {
      const f: UserInterface = JSON.parse(friendJSON as string)
      setFriend(f)
      getChat()
      setPage(1)
      setHasMore(true)
      setMessages([])
      markAsRead()
      setTimeout(() => {
        loadMessages()
      }, 100)
    }, [friendJSON])
  )

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
        Animated.timing(translateY, {
          toValue: event.endCoordinates.height,
          duration: 250,
          useNativeDriver: false,
          easing: Easing.out(Easing.ease),
        }).start()
      }
    )

    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
          easing: Easing.out(Easing.ease),
        }).start()
      }
    )

    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [translateY])


  useEffect(() => {
    socket.connect()
    socket.joinChat(String(chatId))

    socket.onMessage((msg) => {
      setMessages(prev => prev ? [msg, ...prev] : prev)
    })

    return () => socket.disconnect()
  }, [chatId])

  const handleSend = useCallback(async () => {
    Keyboard.dismiss()
    if (!inputValue.trim()) {
      setInputValue('')
      return
    }

    await post(`/messages/${chatId}`, { type: 'text', content: inputValue.trim() })

    scrollViewRef.current?.scrollToEnd()

    setInputValue('')
  }, [inputValue, setInputValue])

  const deleteMessage = useCallback(async (id: string) => {
    const res = await del<ResponseInterface>(`/messages/${id}`)
    if (res.status > 299) {
      Alert.alert('Erro', res.data.message)
    }
    setMessages(prev =>
      prev
        ? prev.filter(m => m.id !== id)
        : prev
    )
  }, [setMessages])

  return (
    <>
      <Stack.Screen
        options={{
          title: friend?.name ?? 'Conversa',
          headerBackTitle: 'Voltar',
          headerRight: () => (
            <View
              style={{
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#EAF2FF',
                borderRadius: 50,
                overflow: 'hidden',
              }}
            >
              <Pressable onPress={() => router.push({
                pathname: '/options' as any,
                params: {
                  friendJSON: friendJSON,
                  blockerIdParam: chat?.blocker_id,
                  friendshipId: chat?.friendship_id
                }
              })}>
                {friend?.profile_image_url ? (
                  <Image
                    source={{ uri: baseURL + friend?.profile_image_url }}
                    style={{ width: 40, height: 40 }}
                  />
                ) : (
                  <MaterialIcons
                    name="person"
                    size={50}
                    color={'#B4DBFF'}
                    style={{ right: 5 }}
                  />
                )}
              </Pressable>
            </View>
          ),
        }}
      />
      <Animated.View style={[{
        transform: chat?.blocker_id ? [] : [{ translateY: Animated.multiply(translateY, -1) }],
        justifyContent: 'flex-start',
        width: '100%',
        height: '100%',
      }]}>
        <View style={[mainStyles.main_container, {
          paddingTop: 2,
          paddingBottom: 8,
          height: 'auto',
          flex: 1,
          minHeight: '80%',
        }]}>
          <FlatList
            style={{
              width: '100%',

            }}
            showsVerticalScrollIndicator={false}
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            inverted
            renderItem={({ item }) => (
              <MessageItem
                mes={item}
                isMine={item.user_id === user?.id}
                onDeleteMessage={() => deleteMessage(item.id)}
              />
            )}
            onEndReached={() => {
              if (hasMore && !loading) loadMessages()
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loading ? <Text style={{ textAlign: 'center' }}>Carregando...</Text> : null
            }
          />
        </View>

        <View
          style={{
            width: '100%',
            maxHeight: '20%',
            minHeight: 108,
            backgroundColor: Colors.light2,
            paddingHorizontal: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            paddingTop: 8,
            paddingBottom: 56
          }}
        >
          {/* <Pressable
          disabled={chat?.blocker_id ? true : false}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 100,
            }}
          >
            <Ionicons name="add-outline" color={chat?.blocker_id ? Colors.gray3 : Colors.red} size={32} />
          </Pressable> */}

          <TextInput
            maxLength={500}
            value={inputValue}
            onChangeText={text => {
              scrollViewRef.current?.scrollToEnd()
              setInputValue(text)
            }}
            placeholder={chat?.is_active ? "Escreva sua mensagem" : 'Esta conversa está bloqueada.'}
            multiline
            numberOfLines={4}
            editable={chat?.is_active ? true : false}
            textAlignVertical="top"
            style={{
              flex: 1,
              minHeight: 40,
              backgroundColor: Colors.light,
              borderRadius: 12,
              paddingHorizontal: 12,
              marginHorizontal: 8,
              color: Colors.textOnInput,
            }}
          />

          <Pressable
            onPress={handleSend}
            disabled={chat?.is_active ? false : true}
            style={{
              backgroundColor: chat?.is_active ? Colors.red : Colors.gray3,
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 100,
            }}
          >
            <Ionicons name="send" color={Colors.light} size={16} />
          </Pressable>
        </View>
      </Animated.View>
    </>
  )
}
