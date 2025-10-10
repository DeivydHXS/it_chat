import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/theme'
import { UserInterface } from '@/interfaces/user-interfaces'

interface FriendItemProps {
    user: UserInterface
    onChatPress?: () => void
    onMenuPress?: () => void
}

export function FriendItem({ user, onChatPress, onMenuPress }: FriendItemProps) {
    const baseURL = process.env.EXPO_PUBLIC_BASE_API_URL

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

            <View style={styles.right}>
                <TouchableOpacity onPress={onChatPress} style={[styles.btn, {backgroundColor: Colors.red}]}>
                <Ionicons name="chatbubble" size={20} color={Colors.light} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onMenuPress} style={styles.btn}>
                <Ionicons name="ellipsis-vertical" size={18} color={Colors.dark} />
            </TouchableOpacity>
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
        height: 30  ,
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
