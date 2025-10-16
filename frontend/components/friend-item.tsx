import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Pressable } from 'react-native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/theme'
import { UserInterface } from '@/interfaces/user-interfaces'
import { useState } from 'react'

interface FriendItemProps {
    user: UserInterface
    onChatPress?: () => void
    block: (id: string) => void
    unblock: (id: string) => void
    unfriend: (id: string) => void
}

export function FriendItem({ user, onChatPress, block, unfriend, unblock }: FriendItemProps) {
    const baseURL = process.env.EXPO_PUBLIC_API_URL
    const [open, setOpen] = useState<boolean>(false)

    return (
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
                <Text style={styles.name}>{user.name}</Text>
            </View>

            <View style={[styles.right, { position: 'relative' }]}>
                <TouchableOpacity onPress={onChatPress} disabled={user.friendship_status === 'b'} style={[styles.btn, { backgroundColor: Colors.red }]}>
                    <Ionicons name={user.friendship_status === 'b' ? "lock-closed" : "chatbubble"} size={20} color={Colors.light} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setOpen(true)} style={styles.btn}>
                    <Ionicons name="ellipsis-vertical" size={18} color={Colors.dark} />
                </TouchableOpacity>
                {open &&
                    <View style={{
                        borderRadius: 24,
                        backgroundColor: Colors.light,
                        minWidth: 120,
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        borderColor: Colors.dark,
                        borderWidth: 1,
                    }}>
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            padding: 8,
                            borderColor: Colors.dark,
                            borderBottomWidth: 1
                        }}>
                            <Pressable style={{ width: '100%' }} onPress={() => setOpen(false)} >
                                <Text style={{ textAlign: 'center', fontWeight: 'condensed', color: Colors.dark }}>X</Text>
                            </Pressable>
                        </View>
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            padding: 8,
                            borderColor: Colors.dark,
                            borderBottomWidth: 1,
                        }}>
                            <Pressable style={{ width: '100%' }} onPress={() => user.friendship_status === 'b' ? unblock(user.friendship_id as string) : block(user.friendship_id as string)} >
                                <Text style={{ textAlign: 'center', fontWeight: 'condensed', color: Colors.dark }}>{user.friendship_status === 'b' ? 'Desbloquear' : 'Bloquear'}</Text>
                            </Pressable>
                        </View>
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            padding: 8
                        }}>
                            <Pressable style={{ width: '100%' }} onPress={() => unfriend(user.friendship_id as string)} >
                                <Text style={{ textAlign: 'center', fontWeight: 'condensed', color: Colors.dark }}>Excluir amigo</Text>
                            </Pressable>
                        </View>
                    </View>
                }
            </View>
        </View >
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
        height: 72,
        marginBottom: 8
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
})
