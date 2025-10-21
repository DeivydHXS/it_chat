import { MenuCustomPressable } from '@/components/menu-custom-pressable'
import { Colors, mainStyles } from '@/constants/theme'
import { UserInterface } from '@/interfaces/user-interfaces'
import { MaterialIcons } from '@expo/vector-icons'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import {
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native'

export default function OptionsScreen() {
    const baseURL = process.env.EXPO_PUBLIC_API_URL

    const { friendJSON } = useLocalSearchParams()
    const [friend, setFriend] = useState<UserInterface>()

    useEffect(() => {
        const f: UserInterface = JSON.parse(friendJSON as string)
        setFriend(f)
    }, [])

    return (
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
                <MenuCustomPressable onPress={() => { }} text='Denunciar conta' />
                <MenuCustomPressable onPress={() => { }} text='Bloquear usuário' />
            </View>
        </View >
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
    }
})