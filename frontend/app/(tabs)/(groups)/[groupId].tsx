import { CustomPressable } from '@/components/custom-pressable'
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
import { navigate } from 'expo-router/build/global-state/routing'
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

export default function GroupScreen() {
  const { user } = useContext(AuthContext)
  const baseURL = process.env.EXPO_PUBLIC_API_URL
  const { get, post, del } = useApi()
  const { groupId } = useLocalSearchParams()
  const [group, setGroup] = useState<ChatInterface>()
  const [messages, setMessages] = useState<MessageInterface[]>()
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const flatListRef = useRef<FlatList>(null)

  const translateY = useRef(new Animated.Value(0)).current
  const [inputValue, setInputValue] = useState('')
  const scrollViewRef = useRef<ScrollView>(null)
  const viewRef = useRef<View>(null)
  const router = useRouter()

  const getGroup = useCallback(async () => {
    const res = await get<{ data: { group: ChatInterface } }>(`/groups/${groupId}`)
    setGroup(res.data.data.group)
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
      }>(`/messages/${groupId}?page=${page}&limit=10`)

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
  }, [groupId, page, hasMore, loading])

  const markAsRead = useCallback(async () => {
    try {
      if (!groupId) return
      await post(`/chats/${groupId}/read`)
    } catch (err) {
      console.warn('Erro ao marcar mensagens como lidas', err)
    }
  }, [groupId])

  useFocusEffect(
    useCallback(() => {
      getGroup()
      setPage(1)
      setHasMore(true)
      setMessages([])
      markAsRead()
      setTimeout(() => {
        loadMessages()
      }, 100)
    }, [])
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

  const socket = SocketService.getInstance(user?.id || '')

  useEffect(() => {
    socket.connect()
    socket.joinChat(String(groupId))

    socket.onMessage((msg) => {
      setMessages(prev => prev ? [msg, ...prev] : prev)
    })

    return () => socket.disconnect()
  }, [groupId])

  const handleSend = async () => {
    Keyboard.dismiss()
    if (!inputValue.trim()) {
      setInputValue('')
      return
    }

    await post(`/messages/${groupId}`, { type: 'text', content: inputValue })
    scrollViewRef.current?.scrollToEnd()

    setInputValue('')
  }

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
          title: group?.name ?? 'grupo',
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
                  groupJSON: groupId
                }
              })}>
                {group?.icon_image_url ? (
                  <Image
                    source={{ uri: baseURL + group?.icon_image_url }}
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
        transform: group?.blocker_id ? [] : [{ translateY: Animated.multiply(translateY, -1) }],
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
          disabled={group?.blocker_id ? true : false}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 100,
            }}
          >
            <Ionicons name="add-outline" color={group?.blocker_id ? Colors.gray3 : Colors.red} size={32} />
          </Pressable> */}

          <TextInput
            maxLength={500}
            value={inputValue}
            onChangeText={text => {
              scrollViewRef.current?.scrollToEnd()
              setInputValue(text)
            }}
            placeholder={group?.is_active ? "Escreva sua mensagem" : 'Esta conversa está bloqueada.'}
            multiline
            numberOfLines={4}
            editable={group?.is_active ? true : false}
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
            disabled={group?.is_active ? false : true}
            style={{
              backgroundColor: group?.is_active ? Colors.red : Colors.gray3,
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
