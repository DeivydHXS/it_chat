import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Pressable } from 'react-native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/theme'
import { UserInterface } from '@/interfaces/user-interfaces'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { ConfirmationModal } from './confirmation-modal'

interface FriendItemProps {
    user: UserInterface
    block: (id: string) => void
    unblock: (id: string) => void
    unfriend: (id: string) => void
}

export function FriendItem({ user, block, unfriend, unblock }: FriendItemProps) {
    const baseURL = process.env.EXPO_PUBLIC_API_URL
    const [open, setOpen] = useState<boolean>(false)
    const router = useRouter()
    const [blockConfirmation, setBlockConfirmation] = useState<boolean>(false)
    const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false)

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
                <TouchableOpacity
                    onPress={() =>
                        user.friendship_status === 'b' ?
                            {} :
                            router.push({
                                pathname: `/(chats)/${user?.chat_id}` as any,
                                params: {
                                    friendJSON: JSON.stringify(user)
                                }
                            })}
                    disabled={user.friendship_status === 'b'} style={[styles.btn, { backgroundColor: Colors.red }]}>
                    <Ionicons name={user.friendship_status === 'b' ? "lock-closed" : "chatbubble"} size={20} color={Colors.light} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setOpen(!open)} style={styles.btn}>
                    <Ionicons name="ellipsis-vertical" size={18} color={Colors.dark} />
                </TouchableOpacity>
                {open &&
                    <View
                        onBlur={() => setOpen(false)}
                        style={{
                            borderRadius: 16,
                            backgroundColor: Colors.light,
                            minWidth: 140,
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            top: 0,
                            right: 36,
                            borderColor: Colors.dark,
                            borderWidth: 1,
                            zIndex: 10
                        }}>
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            padding: 8,
                            borderColor: Colors.dark,
                            borderBottomWidth: 1,
                        }}>
                            <Pressable style={{ width: '100%' }} onPress={() => { }} >
                                <Text style={{ textAlign: 'center', fontWeight: 'condensed', color: Colors.dark }}>{user.friendship_status === 'b' ? 'Desbloquear' : 'Silenciar amigo'}</Text>
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
                                <Text style={{ textAlign: 'center', fontWeight: 'condensed', color: Colors.dark }}>{user.friendship_status === 'b' ? 'Desbloquear' : 'Bloquear amigo'}</Text>
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
