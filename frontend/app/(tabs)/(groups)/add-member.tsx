import { AddMemberItem } from '@/components/add-member-item';
import { Colors, mainStyles } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { ChatInterface } from '@/interfaces/chat-interfaces';
import { ResponseInterfaceAlt } from '@/interfaces/common-interfaces';
import { UserInterface } from '@/interfaces/user-interfaces';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { goBack, navigate } from 'expo-router/build/global-state/routing';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AddMemberScreen() {
    const { get } = useApi()
    const [friends, setFriends] = useState<UserInterface[]>([])
    const [selectedFriends, setSelectedFriends] = useState<UserInterface[]>([])

    const getFriends = useCallback(async () => {
        const res = await get<ResponseInterfaceAlt<'friends', UserInterface[]>>('/friends/accepted')
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

    const addFriends = useCallback(() => {
        
        goBack()
    }, [])

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
    );
}
