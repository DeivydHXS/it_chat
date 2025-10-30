import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Pressable } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/theme'
import { UserInterface } from '@/interfaces/user-interfaces'
import { MessageInterface } from '@/interfaces/chat-interfaces'

interface ChatItemProps {
    user: UserInterface
    onPress?: () => void
    lastMessage?: MessageInterface
}

export function ChatItem({ user, onPress, lastMessage }: ChatItemProps) {
    const baseURL = process.env.EXPO_PUBLIC_API_URL

    const formatMessage = (message?: string) => {
        if (!message)
            return ''

        return message.replace(/(\r\n|\n|\r)/g, " ").trim().slice(0, 25).concat('...')
    }

    return (
        <Pressable style={{ width: '100%', marginBottom: 8 }} onPress={onPress} >
            <View style={styles.container}>
                <View style={styles.left}>
                    <View style={styles.profile_image}>
                        {user?.profile_image_url ?
                            <Image
                                source={{ uri: baseURL + user?.profile_image_url }}
                                style={{ width: 40, height: 40 }}
                            /> :
                            <MaterialIcons name="person" size={50} color={'#B4DBFF'} style={{ right: 5 }} />
                        }
                    </View>
                    <View style={{
                        // maxHeight: 40,
                        overflow: 'hidden'
                    }}>
                        <Text style={styles.name}>{user.name}</Text>
                        <Text style={{ fontSize: 14, color: Colors.gray3 }}>{formatMessage(lastMessage?.content)}</Text>
                    </View>
                </View>

                <View style={[styles.badge, {
                    backgroundColor: Colors.light2,
                }]}>
                    <Text style={{ fontSize: 14, color: Colors.light }}></Text>
                </View>
            </View >
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
        // height: 72
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    status: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    name: {
        fontSize: 14,
        color: Colors.dark,
        fontWeight: '500',
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    btn: {
        width: 40,
        height: 30,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profile_image: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EAF2FF',
        borderRadius: 50,
        overflow: 'hidden',
        marginRight: 16
    },
    badge: {
        color: Colors.light,
        fontWeight: 'condensedBold',
        borderRadius: 100,
        width: 22,
        height: 22,
        alignItems: 'center',
        justifyContent: 'center',
    }
})
