import { ConfirmationModal } from '@/components/confirmation-modal'
import { MenuCustomPressable } from '@/components/menu-custom-pressable'
import { Colors, mainStyles } from '@/constants/theme'
import { AuthContext } from '@/context/auth-context'
import { useApi } from '@/hooks/use-api'
import { ResponseInterface } from '@/interfaces/common-interfaces'
import { UserInterface } from '@/interfaces/user-interfaces'
import { MaterialIcons } from '@expo/vector-icons'
import { useLocalSearchParams } from 'expo-router'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
    Alert,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native'

type ModalAction = 'close' | 'block' | 'unblock'

export default function OptionsScreen() {
    const baseURL = process.env.EXPO_PUBLIC_API_URL
    const { post } = useApi()

    const { user } = useContext(AuthContext)
    const { friendJSON, blockerIdParam, friendshipId } = useLocalSearchParams()
    const [friend, setFriend] = useState<UserInterface>()
    const [blockerId, setBlockerId] = useState<string | undefined>(undefined)
    const [modal, setModal] = useState<ModalAction>('close')

    useEffect(() => {
        const f: UserInterface = JSON.parse(friendJSON as string)
        setFriend(f)
        setBlockerId(blockerIdParam as string)
    }, [])

    const handleOpenModal = useCallback((action: ModalAction = 'close') => {
        setModal(action)
    }, [])

    const modalInfo = useMemo(() => {
        if (!friend || modal === 'close') return null

        const base = {
            title: 'Atenção!',
            onCancel: () => handleOpenModal(),
        }

        switch (modal) {
            case 'block':
                return {
                    ...base,
                    message: `Deseja realmente bloquear ${friend.name}?`,
                    onAccept: async () => {
                        const res = await post<ResponseInterface>(`/friends/${friendshipId}/block`)

                        if (res.status > 299) {
                            Alert.alert('Erro', res.data.message)
                            return
                        }

                        setBlockerId(user?.id)

                        handleOpenModal()
                    },
                }
            case 'unblock':
                return {
                    ...base,
                    message: `Deseja realmente desbloquear ${friend.name}?`,
                    onAccept: async () => {
                        const res = await post<ResponseInterface>(`/friends/${friendshipId}/unblock`)

                        if (res.status > 299) {
                            Alert.alert('Erro', res.data.message)
                            return
                        }

                        setBlockerId(undefined)

                        handleOpenModal()
                    },
                }
            default:
                return null
        }
    }, [modal, friend, post, handleOpenModal, user, setBlockerId, friendshipId])

    return (
        <>
            <View style={mainStyles.main_container}>
                <View style={styles.profile_image}>
                    {friend?.profile_image_url ?
                        <Image
                            source={{ uri: baseURL + friend?.profile_image_url }}
                            style={{ width: 100, height: 100 }}
                        /> :
                        <MaterialIcons name="person" size={120} color={'#B4DBFF'} style={{
                            right: 9
                        }} />
                    }
                </View>

                <View style={styles.name_container}>
                    <Text style={styles.name}>{friend?.name}</Text>
                    <Text style={styles.nickname}>{friend?.nickname}#{friend?.nickname_hash}</Text>
                </View>

                <View style={styles.bio}>
                    <Text style={{
                        color: Colors.gray3
                    }}>{friend?.bio}</Text>
                </View>

                <View style={styles.options}>
                    {/* <MenuCustomPressable onPress={() => { }} text='Denunciar conta' /> */}
                    <MenuCustomPressable onPress={() => handleOpenModal(blockerId ? 'unblock' : 'block')} text={blockerId ? 'Desbloquear usuário' : 'Bloquear usuário'} />
                </View>
            </View >

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
    profile_image: {
        width: 100,
        height: 100,
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