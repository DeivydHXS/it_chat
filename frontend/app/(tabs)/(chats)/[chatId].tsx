import { Colors, mainStyles } from '@/constants/theme'
import { AuthContext } from '@/context/auth-context'
import { useApi } from '@/hooks/use-api'
import { ChatInterface } from '@/interfaces/chat-interfaces'
import { UserInterface } from '@/interfaces/user-interfaces'
import SocketService from '@/services/socket'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { Stack, useLocalSearchParams } from 'expo-router'
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
} from 'react-native'

export default function ChatScreen() {
  const { user } = useContext(AuthContext)
  const baseURL = process.env.EXPO_PUBLIC_API_URL
  const { get } = useApi()
  const { chatId, friendJSON } = useLocalSearchParams()
  const [friend, setFriend] = useState<UserInterface>()
  const [chat, setChat] = useState<ChatInterface>()
  const translateY = useRef(new Animated.Value(0)).current
  const [inputValue, setInputValue] = useState('')
  const scrollViewRef = useRef<ScrollView>(null)
  const viewRef = useRef<View>(null)

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

  const handleSend = async () => {
    Keyboard.dismiss()
    if (!inputValue.trim()) return
    await socket.sendMessage(chatId as string, inputValue)
    scrollViewRef.current?.scrollToEnd()
    setInputValue('')
  }

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
            </View>
          ),
        }}
      />

      <View style={[mainStyles.main_container, { paddingVertical: 0, height: '100%' }]}>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          style={{
            width: '100%',
            height: '80%',
          }}
        >
          {chat && chat.messages.length > 0 ? (
            chat.messages.map((mes, k) => {
              const isMine = mes.user_id === user?.id

              return (
                <View
                  key={k}
                  style={{
                    maxWidth: '80%',
                    alignSelf: isMine ? 'flex-end' : 'flex-start',
                    backgroundColor: isMine ? Colors.red : Colors.gray5,
                    borderRadius: 20,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    marginBottom: 4,
                    marginTop: 4,
                  }}
                >
                  <Text
                    style={{
                      color: isMine ? Colors.light : Colors.dark,
                      fontWeight: 'bold'
                    }}
                  >
                    {isMine ? user?.name : friend?.name}
                  </Text>
                  <Text
                    style={{
                      color: isMine ? Colors.light : Colors.dark,
                    }}
                  >
                    {mes.content}
                  </Text>
                </View>
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

        <View
          style={{
            height: 100,
            backgroundColor: Colors.light2,
            paddingHorizontal: 8,
            gap: 8,
            paddingTop: 8,
            paddingBottom: 56,
          }}
        ></View>
      </View>

      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          transform: [{ translateY: Animated.multiply(translateY, -1) }],
        }}
      >
        <View
          style={{
            height: 100,
            backgroundColor: Colors.light2,
            paddingHorizontal: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            paddingTop: 8,
            paddingBottom: 56,
          }}
        >
          {/* <Pressable
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 100,
            }}
          >
            <Ionicons name="add-outline" color={Colors.red} size={32} />
          </Pressable> */}

          <TextInput
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Escreva sua mensagem"
            multiline
            textAlignVertical="top"
            style={{
              flex: 1,
              minHeight: 40,
              maxHeight: 120,
              backgroundColor: Colors.light,
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 8,
              marginHorizontal: 8,
            }}
          />

          <Pressable
            onPress={handleSend}
            style={{
              backgroundColor: Colors.red,
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
