import { CustomPressable } from '@/components/custom-pressable'
import { MessageItem } from '@/components/message-item'
import { Colors, mainStyles } from '@/constants/theme'
import { AuthContext } from '@/context/auth-context'
import { useApi } from '@/hooks/use-api'
import { ChatInterface } from '@/interfaces/chat-interfaces'
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

export default function GroupScreen() {
  const { user } = useContext(AuthContext)
  const baseURL = process.env.EXPO_PUBLIC_API_URL
  const { get, post, del } = useApi()
  const { groupId } = useLocalSearchParams()
  const [group, setGroup] = useState<ChatInterface>()
  const translateY = useRef(new Animated.Value(0)).current
  const [inputValue, setInputValue] = useState('')
  const scrollViewRef = useRef<ScrollView>(null)
  const viewRef = useRef<View>(null)
  const router = useRouter()

  const getGroup = useCallback(async () => {
    const res = await get<{ data: { group: ChatInterface } }>(`/groups/${groupId}`)
    setGroup(res.data.data.group)
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 300)

  }, [])

  useEffect(() => {
    getGroup()
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
    socket.joinChat(String(groupId))

    socket.onMessage((msg) => {
      setGroup(prev => prev ? { ...prev, messages: [...prev.messages, msg] } : prev)
    })

    return () => socket.disconnect()
  }, [groupId])

  const handleSend = async () => {
    Keyboard.dismiss()
    if (!inputValue.trim()) return
    await post(`/messages/${groupId}`, { type: 'text', content: inputValue })
    scrollViewRef.current?.scrollToEnd()
    setInputValue('')
  }

  const deleteMessage = useCallback(async (id: string, idx: number) => {
    const res = await del<ResponseInterface>(`/messages/${id}`)
    if (res.status > 299) {
      Alert.alert('Erro', res.data.message)
    }
    setGroup(prev =>
      prev
        ? { ...prev, messages: prev.messages.filter(m => m.id !== id) }
        : prev
    )
  }, [setGroup])

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
                  groupJSON: JSON.stringify(group)
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
          minHeight: '80%'
        }]}>
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            style={{
              width: '100%',
            }}
          >
            {group && group.messages.length > 0 ? (
              group.messages.map((mes, idx) => {
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
