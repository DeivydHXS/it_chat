import { View, Text, StyleSheet, Pressable, Image } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/theme'
import { UserInterface } from '@/interfaces/user-interfaces'
import { MessageInterface } from '@/interfaces/chat-interfaces'
import { useEffect, useState } from 'react'
import SocketService from '@/services/socket'

interface ChatItemProps {
    chatId: string
    user: UserInterface
    onPress?: () => void
    lastMessage?: MessageInterface
    unread_count?: number
}

export function ChatItem({ chatId, user, onPress, lastMessage, unread_count = 0 }: ChatItemProps) {
    const baseURL = process.env.EXPO_PUBLIC_API_URL
    const [count, setCount] = useState<number>(0)
    const socket = SocketService.getInstance(user?.id || '')

    const formatMessage = (message?: string) => {
        if (!message) return ''
        if (message.length > 25)
            return message.replace(/(\r\n|\n|\r)/g, ' ').trim().slice(0, 25).concat('...')

        return message.replace(/(\r\n|\n|\r)/g, ' ').trim()
    }

    useEffect(() => {
        const handleUnread = ({ total, chatId: updatedChatId }: { total: number; chatId?: string }) => {
            if (updatedChatId === chatId) {
                setCount(total)
            }
        }

        socket.onMessagesUnreadUpdate(handleUnread)

        return () => {
            socket.offMessagesUnreadUpdate(handleUnread)
        }
    }, [chatId])

    return (
        <Pressable style={{ width: '100%', marginBottom: 8 }} onPress={onPress}>
            <View style={styles.container}>
                <View style={styles.left}>
                    <View style={styles.profile_image}>
                        {user?.profile_image_url ? (
                            <Image
                                source={{ uri: baseURL + user?.profile_image_url }}
                                style={{ width: 40, height: 40 }}
                            />
                        ) : (
                            <MaterialIcons name="person" size={50} color={'#B4DBFF'} style={{ right: 5 }} />
                        )}
                    </View>

                    <View style={{ overflow: 'hidden' }}>
                        <Text style={styles.name}>{user.name}</Text>
                        <Text style={{ fontSize: 14, color: Colors.gray3 }}>
                            {formatMessage(lastMessage?.content)}
                        </Text>
                    </View>
                </View>

                {unread_count > 0 && (
                    <View style={[styles.badge, { backgroundColor: Colors.red }]}>
                        <Text style={{ fontSize: 12, color: Colors.light }}>{unread_count}</Text>
                    </View>
                )}
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.light2,
        padding: 16,
        borderRadius: 24,
        width: '100%',
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        fontSize: 14,
        color: Colors.dark,
        fontWeight: '500',
    },
    profile_image: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EAF2FF',
        borderRadius: 50,
        overflow: 'hidden',
        marginRight: 16,
    },
    badge: {
        borderRadius: 100,
        minWidth: 22,
        height: 22,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
    },
})
