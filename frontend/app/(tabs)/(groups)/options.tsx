import { ConfirmationModal } from '@/components/confirmation-modal'
import { FriendItem } from '@/components/friend-item'
import { MemberItem } from '@/components/member-item'
import { MenuCustomPressable } from '@/components/menu-custom-pressable'
import { Colors, mainStyles } from '@/constants/theme'
import { AuthContext } from '@/context/auth-context'
import { useApi } from '@/hooks/use-api'
import { ChatInterface } from '@/interfaces/chat-interfaces'
import { ResponseInterface } from '@/interfaces/common-interfaces'
import { MaterialIcons } from '@expo/vector-icons'
import { useLocalSearchParams } from 'expo-router'
import { navigate } from 'expo-router/build/global-state/routing'
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
    Alert,
    Animated,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'

type ModalAction = 'close' | 'exit' | 'delete'

export default function OptionsScreen() {
    const baseURL = process.env.EXPO_PUBLIC_API_URL
    const { user } = useContext(AuthContext)
    const { post } = useApi()

    const { groupJSON } = useLocalSearchParams()
    const [group, setGroup] = useState<ChatInterface>()
    const [isAdmin, setIsAdmin] = useState<boolean>(false)
    const [modal, setModal] = useState<ModalAction>('close')

    useEffect(() => {
        const g: ChatInterface = JSON.parse(groupJSON as string)
        setGroup(g)
    }, [setGroup])

    useEffect(() => {
        if (group?.admins?.map(a => a.user_id).includes(user?.id || '')) {
            setIsAdmin(true)
        }
    }, [group, user, setIsAdmin])

    const handleOpenModal = useCallback((action: ModalAction = 'close') => {
        setModal(action)
    }, [])

    const modalInfo = useMemo(() => {
        if (!group || modal === 'close') return null

        const base = {
            title: 'Atenção!',
            onCancel: () => handleOpenModal(),
        }

        switch (modal) {
            case 'exit':
                return {
                    ...base,
                    message: `Deseja realmente sair do grupo?`,
                    onAccept: async () => {
                        const res = await post<ResponseInterface>(`/groups/${group?.id}/exit`)

                        if (res.status > 299) {
                            Alert.alert('Erro', res.data.message)
                            return
                        }

                        navigate('/(groups)')
                        
                        handleOpenModal()
                    },
                }
            case 'delete':
                return {
                    ...base,
                    message: `Deseja realmente deletar o grupo?`,
                    onAccept: async () => {
                        const res = await post<ResponseInterface>(`/groups/${group?.id}/exit`)

                        if (res.status > 299) {
                            Alert.alert('Erro', res.data.message)
                            return
                        }

                        navigate('/(groups)')

                        handleOpenModal()
                    },
                }
            default:
                return null
        }
    }, [modal, post, handleOpenModal, group, user])

    const [modalVisible, setModalVisible] = useState(false)
    const slideAnim = useRef(new Animated.Value(0)).current

    const openModal = () => {
        setModalVisible(true)
        Animated.timing(slideAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start()
    }

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
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{
                    width: '100%',
                    height: 200,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: Colors.gray5
                }}>
                    {group?.cover_image_url ?
                        <Image
                            source={{ uri: baseURL + group?.cover_image_url }}
                            style={{ width: '100%', height: 100 }}
                        /> :
                        ''
                    }
                </View>

                <View style={[mainStyles.main_container, { paddingVertical: 16, alignItems: 'baseline' }]}>
                    <View style={{
                        flexDirection: 'row',
                        gap: 16,

                    }}>
                        <View style={styles.icon_image}>
                            {group?.icon_image_url ?
                                <Image
                                    source={{ uri: baseURL + group?.icon_image_url }}
                                    style={{ width: 56, height: 56 }}
                                /> :
                                <MaterialIcons name="person" size={72} color={'#B4DBFF'} style={{
                                    right: 7
                                }} />
                            }
                        </View>

                        <View style={styles.name_container}>
                            <Text style={styles.name}>{group?.name}</Text>
                        </View>
                    </View>

                    <View style={styles.bio}>
                        <Text style={{
                            color: Colors.gray3
                        }}>{group?.description}</Text>
                    </View>

                    <View style={styles.options}>

                        {/* <MenuCustomPressable onPress={() => { }} text='Denunciar grupo' /> */}
                        {isAdmin ?
                            <>
                                <MenuCustomPressable onPress={openModal} text='Editar informações do grupo' />
                                <MenuCustomPressable onPress={() => handleOpenModal('exit')} text='Sair do grupo' />
                                <MenuCustomPressable onPress={() => handleOpenModal('delete')} text='Excluir grupo' />
                            </>
                            : <MenuCustomPressable onPress={() => handleOpenModal('exit')} text='Sair do grupo' />
                        }
                    </View>

                    <View style={{
                        gap: 16,
                        width: '100%',
                        paddingBottom: 64
                    }}>
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: 18,
                        }}>Membros</Text>
                        <View style={{
                            // backgroundColor: Colors.gray5,
                            gap: 8
                        }}>
                            {isAdmin ?
                                <Pressable
                                    onPress={() => navigate({
                                        pathname: '/add-member',
                                        params: { groupId: group?.id },
                                    })
                                    }
                                    style={{
                                        width: '100%',
                                        height: 64,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: Colors.light2,
                                        borderRadius: 24,
                                        padding: 16
                                    }}>
                                    <Text style={{
                                        fontWeight: 'bold'
                                    }}>Adicionar um membro</Text>
                                </Pressable>
                                : ''}

                            {group?.users.map(user => (
                                <MemberItem
                                    key={user.id}
                                    user={user}
                                    context={false}
                                    openContext={() => { }} />
                            ))}
                        </View>
                    </View >
                </View >
            </ScrollView>
            <Modal
                transparent
                visible={modal !== 'close'}
                animationType="fade"
                onRequestClose={() => handleOpenModal()}
            >
                <Pressable style={styles.overlay} onPress={() => handleOpenModal()}>
                    {modalInfo && (
                        <ConfirmationModal
                            title={modalInfo.title}
                            message={modalInfo.message}
                            onAccept={modalInfo.onAccept}
                            onCancel={modalInfo.onCancel}
                        />
                    )}
                </Pressable>
            </Modal>
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

                        <TouchableOpacity style={styles.option} onPress={() => { }}>
                            <MaterialIcons name="content-copy" size={22} color={Colors.dark} />
                            <Text style={styles.optionText}>Copiar mensagem</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </Pressable>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    icon_image: {
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EAF2FF',
        borderRadius: 50,
        overflow: 'hidden'
    },
    name_container: {
        alignItems: 'center',
        gap: 2
    },
    name: {
        color: Colors.dark,
        fontWeight: 'bold',
        fontSize: 22
    },
    nickname: {
        color: Colors.gray3,
        fontSize: 16
    },
    bio: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.gray4,
        padding: 16
    },
    options: {
        width: '100%',
        gap: 2
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'flex-end',
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
})