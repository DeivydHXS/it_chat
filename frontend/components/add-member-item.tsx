import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Pressable } from 'react-native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/theme'
import { UserInterface } from '@/interfaces/user-interfaces'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'expo-router'
import { Dimensions } from 'react-native';

const windowHeight = Dimensions.get('window').height;

interface AddMemberItemProps {
    user: UserInterface,
    handle: (friend: UserInterface) => void
}

export function AddMemberItem({ user, handle }: AddMemberItemProps) {
    const baseURL = process.env.EXPO_PUBLIC_API_URL
    const router = useRouter()
    const [down, setDown] = useState<boolean>(false)
    const viewRef = useRef<View>(null)
    const [selected, setSelected] = useState<boolean>(false)

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
        <Pressable onPress={() => {
            handle(user)
            setSelected(!selected)
        }} style={styles.container}>
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
                <View
                    style={{
                        width: 24,
                        height: 24,
                        borderRadius: 100,
                        borderWidth: selected ? 0 : 2,
                        backgroundColor: selected ? Colors.check : Colors.light,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Ionicons name="checkmark" size={18} color={Colors.light} />
                </View>
            </View>
        </Pressable >
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
