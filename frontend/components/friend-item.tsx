import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Pressable } from 'react-native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/theme'
import { UserInterface } from '@/interfaces/user-interfaces'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'expo-router'
import { Dimensions } from 'react-native';

const windowHeight = Dimensions.get('window').height;

interface FriendItemProps {
    user: UserInterface
    block: (id: string) => void
    unblock: (id: string) => void
    unfriend: (id: string) => void
    openContext: (id?: string) => void
    context: boolean
}

export function FriendItem({ user, block, unfriend, unblock, openContext, context }: FriendItemProps) {
    const baseURL = process.env.EXPO_PUBLIC_API_URL
    const router = useRouter()
    const [down, setDown] = useState<boolean>(false)
    const viewRef = useRef<View>(null)

    const getPosition = useCallback(() => {
        viewRef.current?.measure((fx, fy, width, height, px, py) => {
            if (py >= (windowHeight / 2)) {
                setDown(true)
                return
            }
            setDown(false)
            return
        })
    }, [viewRef])

    useEffect(() => {
        getPosition()
    }, [])

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
                    disabled={user.friendship_status === 'b'} style={[styles.btn, { backgroundColor: user.friendship_status === 'b' ? Colors.gray3 : Colors.red }]}>
                    <Ionicons name={user.friendship_status === 'b' ? "lock-closed" : "chatbubble"} size={20} color={Colors.light} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    getPosition()
                    openContext(context ? undefined : user.id)
                }} style={styles.btn}>
                    <Ionicons name="ellipsis-vertical" size={18} color={Colors.dark} />
                </TouchableOpacity>
                {context &&
                    <View
                        ref={viewRef}
                        style={{
                            borderTopLeftRadius: 16,
                            borderBottomLeftRadius: 16,
                            borderBottomRightRadius: down ? 2 : 16,
                            borderTopRightRadius: down ? 16 : 2,
                            backgroundColor: Colors.light,
                            minWidth: 140,
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            top: down ? -50 : 5,
                            right: 36,
                            borderColor: Colors.dark,
                            borderWidth: 1,
                            zIndex: 10
                        }}>
                        {/* <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            padding: 8,
                            borderColor: Colors.dark,
                            borderBottomWidth: 1,
                        }}>
                            <Pressable style={{ width: '100%' }} onPress={() => { }} >
                                <Text style={{ textAlign: 'center', fontWeight: 'condensed', color: Colors.dark }}>{user.silencied ? 'Dessilenciar' : 'Silenciar amigo'}</Text>
                            </Pressable>
                        </View> */}
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
