import { FriendItem } from '@/components/friend-item';
import { FriendRequestItem } from '@/components/friend-item-request';
import { SearchBar } from '@/components/search-bar';
import { TabSelector } from '@/components/tab-selector';
import { Colors, mainStyles } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { ResponseInterfaceAlt } from '@/interfaces/common-interfaces';
import { UserInterface } from '@/interfaces/user-interfaces';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function FriendsScreen() {
  const { get } = useApi()

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

  return (
    <View style={mainStyles.main_container}>
      <SearchBar value={search}
        onChange={text => {
          setSearch(text)
          doSearch()
        }} />
      <TabSelector active={tab} onChange={setTab} requestsCount={0} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {tab === 'friends'
          ? friends.map((f, i) => <FriendItem key={i} user={f} />)
          : requests.map((r, i) => <FriendRequestItem key={i} user={r} />)}
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
        <Ionicons name="add" size={32} color={Colors.light} />
      </View>
    </View>
  )
}