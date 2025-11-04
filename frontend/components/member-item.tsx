import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Pressable, Animated, Modal } from 'react-native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/theme'
import { UserInterface } from '@/interfaces/user-interfaces'
import { useCallback, useContext, useRef, useState } from 'react'
import { AuthContext } from '@/context/auth-context'
import { ResponseInterface } from '@/interfaces/common-interfaces'
import { ChatInterface } from '@/interfaces/chat-interfaces'
import { useApi } from '@/hooks/use-api'

interface MemberItemProps {
    user: UserInterface
    isAdmin: boolean
    memberIsAdmin: boolean
    group: ChatInterface
    setGroup: React.Dispatch<React.SetStateAction<ChatInterface | undefined>>
}

export function MemberItem(props: MemberItemProps) {
    const baseURL = process.env.EXPO_PUBLIC_API_URL
    const { post } = useApi()

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

    const deleteMember = useCallback(async () => {
        const res = await post<ResponseInterface>(`/groups/${props.group?.id}/remove-member`, { memberId: props.user.id })

        if (res.status > 299) {
            Alert.alert('Erro', res.data.message)
            return
        }

        props.setGroup(prev => {
            return {
                ...prev,
                users: prev?.users?.filter(u => u.id !== props.user.id)
            } as ChatInterface
        })

        closeModal()
    }, [props])

    const changePermission = useCallback(async () => {
        const permissionType = props.memberIsAdmin ? 'm' : 'c'

        const res = await post<ResponseInterface>(
            `/groups/${props.group?.id}/change-permission`,
            { memberId: props.user.id, permissionType }
        )

        if (res.status > 299) {
            Alert.alert('Erro', res.data.message)
            return
        }

        props.setGroup(prev => {
            if (!prev) return prev

            const updatedUsers = prev.users?.map(u =>
                u.id === props.user.id ? { ...u, permission_type: permissionType } : u
            ) || []

            return {
                ...prev,
                users: updatedUsers,
            } as ChatInterface
        })

        closeModal()
    }, [props])

    return (
        <>
            <View style={styles.container}>
                <View style={styles.left}>
                    <View style={styles.profile_image}>
                        {props.user?.profile_image_url ?
                            <Image
                                source={{ uri: baseURL + (props.user?.profile_image_url || '') }}
                                style={{ width: 40, height: 40 }}
                            /> :
                            <MaterialIcons name="person" size={50} color={'#B4DBFF'} style={{ right: 5 }} />
                        }
                    </View>
                    <Text style={styles.name}>{props.user.name}</Text>
                </View>

                {props.isAdmin ? <View style={[styles.right, { position: 'relative' }]}>
                    <TouchableOpacity onPress={openModal} style={styles.btn}>
                        <Ionicons name="ellipsis-vertical" size={18} color={Colors.dark} />
                    </TouchableOpacity>
                </View> : ''}
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
                        <TouchableOpacity style={styles.option} onPress={changePermission}>
                            <MaterialIcons name={props.memberIsAdmin ? 'remove-moderator' : 'add-moderator'} size={22} color={Colors.dark} />
                            <Text style={styles.optionText}>{props.memberIsAdmin ? 'Rebaixar para membro' : 'Promover para co-admin'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.option} onPress={deleteMember}>
                            <MaterialIcons name="person-remove-alt-1" size={22} color={Colors.dark} />
                            <Text style={styles.optionText}>Excluir membro</Text>
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
