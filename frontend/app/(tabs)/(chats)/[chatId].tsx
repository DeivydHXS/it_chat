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
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
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
} from 'react-native'

export default function ChatScreen() {
  const { user } = useContext(AuthContext)
  const baseURL = process.env.EXPO_PUBLIC_API_URL
  const { get, post, del } = useApi()
  const { chatId, friendJSON } = useLocalSearchParams()
  const [friend, setFriend] = useState<UserInterface>()
  const [chat, setChat] = useState<ChatInterface>()
  const translateY = useRef(new Animated.Value(0)).current
  const [inputValue, setInputValue] = useState('')
  const scrollViewRef = useRef<ScrollView>(null)
  const viewRef = useRef<View>(null)
  const router = useRouter()

  const getChat = useCallback(async () => {
    const res = await get<{ data: { chat: ChatInterface } }>(`/chats/${chatId}`)
    setChat(res.data.data.chat)
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 300)

  }, [])

  useEffect(() => {
    const f: UserInterface = JSON.parse(friendJSON as string)
    setFriend(f)
    getChat()
  }, [])

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
    socket.joinChat(String(chatId))

    socket.onMessage((msg) => {
      setChat(prev => prev ? { ...prev, messages: [...prev.messages, msg] } : prev)
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
    // setChat(prev => prev ? { ...prev, messages: [...prev.messages, {
    //   type: 'text',
    //   content: inputValue,
    //   user_id: user?.id
    // } as MessageInterface] } : prev)

    setInputValue('')
  }, [inputValue, setInputValue])

  const deleteMessage = useCallback(async (id: string, idx: number) => {
    const res = await del<ResponseInterface>(`/messages/${id}`)
    if (res.status > 299) {
      Alert.alert('Erro', res.data.message)
    }
    setChat(prev =>
      prev
        ? { ...prev, messages: prev.messages.filter(m => m.id !== id) }
        : prev
    )
  }, [setChat])

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
                  friendJSON: friendJSON
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
          minHeight: '80%'
        }]}>
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            style={{
              width: '100%',
            }}
          >
            {chat && chat.messages.length > 0 ? (
              chat.messages.map((mes, idx) => {
                return (
                  <MessageItem
                    key={mes.id}
                    isMine={mes.user_id === user?.id}
                    mes={mes}
                    onDeleteMessage={() => {
                      deleteMessage(mes.id, idx)
                    }}
                  />
                )
              })

            ) : (
              <View
                style={{
                  width: '100%',
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text>Mande um 'oi' para seu amigo.</Text>
              </View>
            )}
            <View ref={viewRef}></View>
          </ScrollView>
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
