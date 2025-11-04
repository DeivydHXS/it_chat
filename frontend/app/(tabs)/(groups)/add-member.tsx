import { AddMemberItem } from '@/components/add-member-item'
import { Colors, mainStyles } from '@/constants/theme'
import { ApiResponse, useApi } from '@/hooks/use-api'
import { ResponseInterfaceAlt } from '@/interfaces/common-interfaces'
import { UserInterface } from '@/interfaces/user-interfaces'
import { Ionicons } from '@expo/vector-icons'
import { goBack } from 'expo-router/build/global-state/routing'
import { useCallback, useEffect, useState } from 'react'
import { Alert, Pressable, ScrollView, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

export default function AddMemberScreen() {
    const { get, post } = useApi()
    const [friends, setFriends] = useState<UserInterface[]>([])
    const [selectedFriends, setSelectedFriends] = useState<UserInterface[]>([])

    const { groupId } = useLocalSearchParams<{ groupId: string }>()

    const getFriends = useCallback(async () => {
        const res = await get<ResponseInterfaceAlt<'friends', UserInterface[]>>('/friends', { tab: 'friends' })
        setFriends(res.data.data?.friends || [])
    }, [])

    const selectFriend = useCallback((friend: UserInterface) => {
        setSelectedFriends(prev => {
            if (prev.some(f => f.id === friend.id)) {
                return prev.filter(f => f.id !== friend.id)
            }
            return [...prev, friend]
        })
    }, [setSelectedFriends])

    useEffect(() => {
        getFriends()
    }, [])

    const addFriends = useCallback(async () => {
        const res = await post<ResponseInterfaceAlt>(`/groups/${groupId}/add-members`, { friendsIds: selectedFriends.map(f => f.id) })

        if (res.status > 299) {
            Alert.alert('Erro', res.data.message)
        }
        goBack()
    }, [selectedFriends])

    return (
        <View style={mainStyles.main_container}>
            {/* <View>
                {selectedFriends.map(friend => (
                    <View key={friend.id}>
                        <Text>{friend.name}</Text>
                    </View>
                ))}
            </View> */}

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                    width: '100%',
                }}>
                {friends.map((friend, idx) => (
                    <AddMemberItem
                        key={idx}
                        user={friend}
                        handle={selectFriend}
                    />
                ))}
            </ScrollView>

            <View
                style={{
                    position: 'absolute',
                    right: 16,
                    bottom: 64,
                    borderRadius: 100,
                    backgroundColor: Colors.red,
                    width: 48,
                    height: 48,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Pressable
                    onPress={addFriends}>
                    <Ionicons name="arrow-forward" size={32} color={Colors.light} />
                </Pressable>
            </View>
        </View>
    )
}
