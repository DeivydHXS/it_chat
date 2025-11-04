import { ConfirmationModal } from '@/components/confirmation-modal'
import { MemberItem } from '@/components/member-item'
import { MenuCustomPressable } from '@/components/menu-custom-pressable'
import { Colors, mainStyles } from '@/constants/theme'
import { AuthContext } from '@/context/auth-context'
import { useApi } from '@/hooks/use-api'
import { ChatInterface } from '@/interfaces/chat-interfaces'
import { ResponseInterface } from '@/interfaces/common-interfaces'
import { MaterialIcons } from '@expo/vector-icons'
import { useLocalSearchParams, usePathname } from 'expo-router'
import { navigate } from 'expo-router/build/global-state/routing'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
    Alert,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native'

type ModalAction = 'close' | 'exit' | 'delete'

export default function OptionsScreen() {
    const baseURL = process.env.EXPO_PUBLIC_API_URL
    const { user } = useContext(AuthContext)
    const { get, post } = useApi()
    const pathname = usePathname()

    const { groupJSON } = useLocalSearchParams()
    const [group, setGroup] = useState<ChatInterface>()
    const [isAdmin, setIsAdmin] = useState<boolean>(false)
    const [modal, setModal] = useState<ModalAction>('close')

    const isAdminFunction = useCallback((user_id?: string) => {
        if (!group?.admins) {
            return false
        }

        return group.admins.some(a => a.user_id === user_id)
    }, [group])

    const getGroup = useCallback(async () => {
        const res = await get<{ data: { group: ChatInterface } }>(`/groups/${groupJSON}`)
        setGroup(res.data.data.group)
    }, [])

    useEffect(() => {
        if (pathname === '/options') {
            getGroup()
        }
    }, [pathname])

    useEffect(() => {
        setIsAdmin(isAdminFunction(user?.id))
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
                                <MenuCustomPressable onPress={() => { }} text='Editar informações do grupo' />
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

                            {group?.users.map(u => (
                                <MemberItem
                                    key={u.id}
                                    user={u}
                                    memberIsAdmin={isAdminFunction(u.id)}
                                    isAdmin={isAdmin}
                                    group={group}
                                    setGroup={setGroup}
                                />
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
})