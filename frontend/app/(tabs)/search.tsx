import { SearchBar } from '@/components/search-bar'
import { SearchUserItem } from '@/components/search-user-item'
import { mainStyles } from '@/constants/theme'
import { useApi } from '@/hooks/use-api'
import { ResponseInterfaceAlt } from '@/interfaces/common-interfaces'
import { UserInterface } from '@/interfaces/user-interfaces'
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

export default function SearchScreen() {
  const { get } = useApi()

  const [users, setUsers] = useState<UserInterface[]>([])
  const [search, setSearch] = useState('')

  const doSearch = useCallback(async () => {
    const res = await get<ResponseInterfaceAlt<'users', UserInterface[]>>('/users', { search })
    setUsers(res.data.data?.users || [])
  }, [setUsers, search])

  return (
    <View style={mainStyles.main_container}>
      <SearchBar value={search}
        onChange={text => {
          setSearch(text)
          doSearch()
        }} />

      <ScrollView showsVerticalScrollIndicator={false}>
          {users.map((f, i) => <SearchUserItem key={i} user={f} />)}
      </ScrollView>
    </View>
  )
}