import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Pressable, Modal, Animated } from 'react-native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/theme'
import { UserInterface } from '@/interfaces/user-interfaces'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'expo-router'
import { Dimensions } from 'react-native'

const windowHeight = Dimensions.get('window').height

interface FriendItemProps {
    user: UserInterface
    block: (id: string) => void
    unblock: (id: string) => void
    unfriend: (id: string) => void
}

export function FriendItem({ user, block, unfriend, unblock }: FriendItemProps) {
    const baseURL = process.env.EXPO_PUBLIC_API_URL
    const router = useRouter()

    const [modalVisible, setModalVisible] = useState(false)
    const slideAnim = useRef(new Animated.Value(0)).current

    const openModal = useCallback(() => {
        setModalVisible(true)
        Animated.timing(slideAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start()
    }, [])

    const closeModal = () => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => setModalVisible(false))
    }

    const translateY = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0],
    })

    return (
        <>
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
                    <TouchableOpacity onPress={openModal} style={styles.btn}>
                        <Ionicons name="ellipsis-vertical" size={18} color={Colors.dark} />
                    </TouchableOpacity>
                </View>
            </View >
            <Modal
                transparent
                visible={modalVisible}
                animationType="none"
                onRequestClose={closeModal}
            >
                <Pressable style={styles.overlay} onPress={closeModal}>
                    <Animated.View
                        style={[
                            styles.bottomSheet,
                            { transform: [{ translateY }] },
                        ]}
                    >
                        <View style={styles.handle} />
                        <TouchableOpacity style={styles.option} onPress={() => user.friendship_status === 'b' ? unblock(user.friendship_id as string) : block(user.friendship_id as string)}>
                            <MaterialIcons name={user.friendship_status === 'b' ? 'remove-moderator' : 'add-moderator'} size={22} color={Colors.dark} />
                            <Text style={styles.optionText}>{user.friendship_status === 'b' ? 'Desbloquear' : 'Bloquear amigo'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.option} onPress={() => unfriend(user.friendship_id as string)}>
                            <MaterialIcons name="person-remove-alt-1" size={22} color={Colors.dark} />
                            <Text style={styles.optionText}>Excluir amigo</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </Pressable>
            </Modal>
        </>
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
    bottomSheet: {
        backgroundColor: Colors.light2,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 20,
        elevation: 8,
    },
    handle: {
        alignSelf: 'center',
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.gray4,
        marginBottom: 12,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
    },
    optionText: {
        marginLeft: 10,
        fontSize: 16,
        color: Colors.dark,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'flex-end',
    },
})
