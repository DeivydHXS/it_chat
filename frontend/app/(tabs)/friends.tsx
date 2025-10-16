import { CustomInputText } from '@/components/custom-input-text';
import { FriendItem } from '@/components/friend-item';
import { FriendRequestItem } from '@/components/friend-item-request';
import { SearchBar } from '@/components/search-bar';
import { TabSelector } from '@/components/tab-selector';
import { Colors, mainStyles } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { ResponseInterface, ResponseInterfaceAlt } from '@/interfaces/common-interfaces';
import { UserInterface } from '@/interfaces/user-interfaces';
import { Ionicons } from '@expo/vector-icons';
import { navigate } from 'expo-router/build/global-state/routing';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function FriendsScreen() {
  const { get, post, del } = useApi()

  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<'friends' | 'requests'>('friends')
  const [friends, setFriends] = useState<UserInterface[]>([])
  const [requests, setRequests] = useState<UserInterface[]>([])

  const getFriends = useCallback(async () => {
    const res = await get<ResponseInterfaceAlt<'friends', UserInterface[]>>('/friends/accepted')
    setFriends(res.data.data?.friends || [])
  }, [setFriends])

  const getRequests = useCallback(async () => {
    const res = await get<ResponseInterfaceAlt<'solicitations', UserInterface[]>>('/friends/pending')
    setRequests(res.data.data?.solicitations || [])
  }, [setRequests])

  useEffect(() => {
    getFriends()
    getRequests()
  }, [])

  const doSearch = useCallback(async () => {
    const res = await get<ResponseInterfaceAlt<'friends', UserInterface[]>>('/friends', { search, tab })

    if (tab === 'friends') {
      setFriends(res.data.data?.friends || [])
    }
    if (tab === 'requests') {
      setRequests(res.data.data?.friends || [])
    }
  }, [setFriends, setRequests, search])

  const accept = useCallback(async (id: string) => {
    const res = await post<ResponseInterface>(`/friends/${id}/accept`)
    setRequests(prev => prev.filter(r => r.friendship_id !== id))

    Alert.alert(res.data.message)
  }, [setRequests])

  const refuse = useCallback(async (id: string) => {
    const res = await post<ResponseInterface>(`/friends/${id}/decline`)
    setRequests(prev => prev.filter(r => r.friendship_id !== id))

    Alert.alert(res.data.message)
  }, [setRequests])

  const block = useCallback(async (id: string) => {
    const res = await post<ResponseInterface>(`/friends/${id}/block`)
    setFriends(prev => prev.map(f => f.id === id ? { ...f, friendship_status: 'b' } : f))

    Alert.alert(res.data.message)
  }, [setFriends])

  const unblock = useCallback(async (id: string) => {
    const res = await post<ResponseInterface>(`/friends/${id}/unblock`)
    setFriends(prev => prev.map(f => f.id === id ? { ...f, friendship_status: 'a' } : f))

    Alert.alert(res.data.message)
  }, [setFriends])

  const unfriend = useCallback(async (id: string) => {
    const res = await del<ResponseInterface>(`/friends/${id}/unfriend`)
    setFriends(prev => prev.filter(r => r.friendship_id !== id))

    Alert.alert(res.data.message)
  }, [setFriends])

  return (
    <View style={mainStyles.main_container}>
      <SearchBar value={search}
        onChange={text => {
          setSearch(text)
          doSearch()
        }} />

      <TabSelector active={tab} onChange={tab => {
        getFriends()
        getRequests()
        setTab(tab)
      }} requestsCount={0} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {tab === 'friends'
          ? friends.map((f, i) => <FriendItem key={i} user={f} block={block} unfriend={unfriend} unblock={unblock} />)
          : requests.map((r, i) => <FriendRequestItem key={i} user={r}
            onAccept={() => accept(r.friendship_id as string)}
            onReject={() => refuse(r.friendship_id as string)} />)}
      </ScrollView>

      <View style={{
        position: 'absolute',
        right: 16,
        bottom: 16,
        borderRadius: 100,
        backgroundColor: Colors.red,
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Pressable onPress={() => {
          navigate('/(tabs)/search')
        }}>
          <Ionicons name="add" size={32} color={Colors.light} />
        </Pressable>
      </View>
    </View>
  )
}