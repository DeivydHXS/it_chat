import { ConfirmationModal } from '@/components/confirmation-modal'
import { FriendItem } from '@/components/friend-item'
import { FriendRequestItem } from '@/components/friend-item-request'
import { SearchBar } from '@/components/search-bar'
import { TabSelector } from '@/components/tab-selector'
import { Colors, mainStyles } from '@/constants/theme'
import { useApi } from '@/hooks/use-api'
import { ResponseInterface, ResponseInterfaceAlt } from '@/interfaces/common-interfaces'
import { UserInterface } from '@/interfaces/user-interfaces'
import { Ionicons } from '@expo/vector-icons'
import { usePathname } from 'expo-router'
import { navigate } from 'expo-router/build/global-state/routing'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native'

type ModalAction = 'close' | 'block' | 'unfriend' | 'unblock'

export default function FriendsScreen() {
  const { get, post, del } = useApi()

  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<'friends' | 'requests'>('friends')
  const [friends, setFriends] = useState<UserInterface[]>([])
  const [requests, setRequests] = useState<UserInterface[]>([])
  const [friend, setFriend] = useState<UserInterface | undefined>(undefined)
  const [modal, setModal] = useState<ModalAction>('close')
  const [context, setContext] = useState<string | undefined>(undefined)
  const pathname = usePathname()

  const getFriends = useCallback(async () => {
    const res = await get<ResponseInterfaceAlt<'friends', UserInterface[]>>('/friends', { tab: 'friends' })
    setFriends(res.data.data?.friends || [])
  }, [setFriends])

  const getRequests = useCallback(async () => {
    const res = await get<ResponseInterfaceAlt<'friends', UserInterface[]>>('/friends', { tab: 'requests' })
    setRequests(res.data.data?.friends || [])
  }, [setRequests])

  useEffect(() => {
    if (pathname === '/friends') {
      getFriends()
      getRequests()
      setSearch('')
    }
  }, [pathname])

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

  const handleOpenModal = useCallback((action: ModalAction = 'close', friend?: UserInterface) => {
    setFriend(friend)
    setModal(action)
  }, [])

  const handleOpenContext = useCallback((id?: string) => {
    setContext(id)
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
            const res = await post<ResponseInterface>(`/friends/${friend.friendship_id}/block`)

            if (res.status > 299) {
              Alert.alert('Erro', res.data.message)
              return
            }

            setFriends(prev =>
              prev.map(f => (f.id === friend.id ? { ...f, friendship_status: 'b' } : f))
            )

            handleOpenModal()
          },
        }
      case 'unblock':
        return {
          ...base,
          message: `Deseja realmente desbloquear ${friend.name}?`,
          onAccept: async () => {
            const res = await post<ResponseInterface>(`/friends/${friend.friendship_id}/unblock`)

            if (res.status > 299) {
              Alert.alert('Erro', res.data.message)
              return
            }

            setFriends(prev =>
              prev.map(f => (f.id === friend.id ? { ...f, friendship_status: 'a' } : f))
            )
            handleOpenModal()
          },
        }
      case 'unfriend':
        return {
          ...base,
          message: `Deseja realmente desfazer a amizade com ${friend.name}?`,
          onAccept: async () => {
            const res = await del<ResponseInterface>(`/friends/${friend.friendship_id}/unfriend`)

            if (res.status > 299) {
              Alert.alert('Erro', res.data.message)
              return
            }

            setFriends(prev => prev.filter(f => f.id !== friend.id))
            handleOpenModal()
          },
        }
      default:
        return null
    }
  }, [modal, friend, post, del, setFriends, handleOpenModal])

  return (
    <>
      <View style={mainStyles.main_container}>
        <SearchBar value={search}
          onChange={(text) => {
            setSearch(text)
            doSearch()
          }}
          cleanFunction={() => {
            if (tab === 'friends')
              getFriends()
            else if (tab === 'requests')
              getRequests()
          }}
        />

        <TabSelector
          active={tab}
          onChange={tab => {
            if (tab === 'friends')
              getFriends()
            else if (tab === 'requests')
              getRequests()
            setTab(tab)
          }}
          requestsCount={0}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          {tab === 'friends'
            ? friends.map((f, i) => (
              <FriendItem
                key={i}
                user={f}
                block={() => handleOpenModal('block', f)}
                unfriend={() => handleOpenModal('unfriend', f)}
                unblock={() => handleOpenModal('unblock', f)}
                context={context === f.id}
                openContext={handleOpenContext}
              />
            ))
            : requests.map((r, i) => (
              <FriendRequestItem
                key={i}
                user={r}
                onAccept={() => accept(r.friendship_id as string)}
                onReject={() => refuse(r.friendship_id as string)}
              />
            ))}
        </ScrollView>

        <View
          style={{
            position: 'absolute',
            right: 16,
            bottom: 16,
            borderRadius: 100,
            backgroundColor: Colors.red,
            width: 48,
            height: 48,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Pressable
            onPress={() => {
              navigate('/(tabs)/search')
            }}
          >
            <Ionicons name="add" size={32} color={Colors.light} />
          </Pressable>
        </View>
      </View>

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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },
})