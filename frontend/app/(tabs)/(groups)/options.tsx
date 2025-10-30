import { FriendItem } from '@/components/friend-item'
import { MemberItem } from '@/components/member-item'
import { MenuCustomPressable } from '@/components/menu-custom-pressable'
import { Colors, mainStyles } from '@/constants/theme'
import { AuthContext } from '@/context/auth-context'
import { ChatInterface } from '@/interfaces/chat-interfaces'
import { MaterialIcons } from '@expo/vector-icons'
import { useLocalSearchParams } from 'expo-router'
import { navigate } from 'expo-router/build/global-state/routing'
import { useContext, useEffect, useState } from 'react'
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native'

export default function OptionsScreen() {
    const baseURL = process.env.EXPO_PUBLIC_API_URL
    const { user } = useContext(AuthContext)

    const { groupJSON } = useLocalSearchParams()
    const [group, setGroup] = useState<ChatInterface>()

    useEffect(() => {
        const g: ChatInterface = JSON.parse(groupJSON as string)
        setGroup(g)
    }, [])

    return (
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
                    <MenuCustomPressable onPress={() => { }} text='Editar informações do grupo' />
                    {/* <MenuCustomPressable onPress={() => { }} text='Denunciar grupo' /> */}
                    <MenuCustomPressable onPress={() => { }} text='Sair do grupo' />
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
                        {group?.admins?.map(a => a.id).includes(user?.id) ?
                            <Pressable
                                onPress={() => navigate({
                                    pathname: '/(groups)/add-member',
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
    }
})