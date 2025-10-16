import { CustomInputText } from '@/components/custom-input-text'
import { Colors, mainStyles } from '@/constants/theme'
import { useApi } from '@/hooks/use-api'
import { ChatInterface } from '@/interfaces/chat-interfaces'
import { UserInterface } from '@/interfaces/user-interfaces'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { View, Text, Image, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native'

export default function ChatScreen() {
    const baseURL = process.env.EXPO_PUBLIC_API_URL + '/'
    const { get } = useApi()
    const { chatId, friendJSON } = useLocalSearchParams()
    const [friend, setFriend] = useState<UserInterface>()
    const [chat, setChat] = useState<ChatInterface>()

    const getChat = useCallback(async () => {
        const res = await get<{ data: { chat: ChatInterface } }>(`/chats/${chatId}`)
        setChat(res.data.data.chat)
    }, [])

    useEffect(() => {
        const f: UserInterface = JSON.parse(friendJSON as string)
        setFriend(f)
        getChat()
    }, [])

    return (
        <>
            <Stack.Screen
                options={{
                    title: friend?.name ?? 'Chat',
                    headerBackTitle: 'Voltar',
                    headerRight: (props) => (
                        <View style={{
                            width: 40,
                            height: 40,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#EAF2FF',
                            borderRadius: 50,
                            overflow: 'hidden'
                        }}>
                            {friend?.profile_image_url ?
                                <Image
                                    source={{ uri: baseURL + friend?.profile_image_url }}
                                    style={{ width: 40, height: 40 }}
                                /> :
                                <MaterialIcons name="person" size={50} color={'#B4DBFF'} style={{
                                    right: 5
                                }} />}
                        </View>
                    ),
                }}
            />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={95}
            >
                <View style={mainStyles.main_container}>
                    <ScrollView>
                        {chat ?
                            chat.messages.map(mes => (
                                <View>
                                    <Text>{mes.content}</Text>
                                </View>
                            )) :
                            <View>
                                <Text>Mande um 'oi' para seu amigo.</Text>
                            </View>
                        }
                    </ScrollView>


                </View>
                <View style={{ width: '100%' }}>
                    <View
                        style={{
                            height: 72,
                            width: '100%',
                            backgroundColor: Colors.light2,
                            position: 'absolute',
                            zIndex: 100,
                            bottom: 0,
                            left: 0,
                            paddingHorizontal: 8,
                            paddingVertical: 8,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 8,
                        }}
                    >
                        <Pressable
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 40,
                                height: 40,
                                borderRadius: 100,
                            }}
                        >
                            <Ionicons name="add-outline" color={Colors.red} size={32} />
                        </Pressable>

                        <TextInput
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
                </View>
            </KeyboardAvoidingView>
        </>
    )
}