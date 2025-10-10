import { FriendItem } from '@/components/friend-item';
import { FriendRequestItem } from '@/components/friend-item-request';
import { SearchBar } from '@/components/search-bar';
import { TabSelector } from '@/components/tab-selector';
import { Colors, mainStyles } from '@/constants/theme';
import { UserInterface } from '@/interfaces/user-interfaces';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function FriendsScreen() {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<'friends' | 'requests'>('friends')

  const friends = [
    { name: 'Maikon', profile_image_url: '/uploads/profile_images/vqsyq54topsci60kkn5mm6na.jpg' },
    { name: 'Edu', profile_image_url: '' },
    { name: 'Pam', profile_image_url: '' },
    { name: 'Davi', profile_image_url: '' },
    { name: 'Deigo', profile_image_url: '' },
    { name: 'Maikon', profile_image_url: '/uploads/profile_images/vqsyq54topsci60kkn5mm6na.jpg' },
    { name: 'Edu', profile_image_url: '' },
    { name: 'Pam', profile_image_url: '' },
    { name: 'Davi', profile_image_url: '' },
    { name: 'Deigo', profile_image_url: '' },
    { name: 'Maikon', profile_image_url: '/uploads/profile_images/vqsyq54topsci60kkn5mm6na.jpg' },
    { name: 'Edu', profile_image_url: '' },
    { name: 'Pam', profile_image_url: '' },
    { name: 'Davi', profile_image_url: '' },
    { name: 'Deigo', profile_image_url: '' },
  ] as UserInterface[]

  const requests = [
    { name: 'Maikon', profile_image_url: '/uploads/profile_images/vqsyq54topsci60kkn5mm6na.jpg' },
    { name: 'Edu', profile_image_url: '' },
    { name: 'Pam', profile_image_url: '' },
    { name: 'Davi', profile_image_url: '' },
    { name: 'Deigo', profile_image_url: '' },
    { name: 'Maikon', profile_image_url: '/uploads/profile_images/vqsyq54topsci60kkn5mm6na.jpg' },
    { name: 'Edu', profile_image_url: '' },
    { name: 'Pam', profile_image_url: '' },
    { name: 'Davi', profile_image_url: '' },
    { name: 'Deigo', profile_image_url: '' },
    { name: 'Maikon', profile_image_url: '/uploads/profile_images/vqsyq54topsci60kkn5mm6na.jpg' },
    { name: 'Edu', profile_image_url: '' },
    { name: 'Pam', profile_image_url: '' },
  ] as UserInterface[]

  return (
    <View style={mainStyles.main_container}>
      <SearchBar value={search} onChange={setSearch} />
      <TabSelector active={tab} onChange={setTab} requestsCount={2} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {tab === 'friends'
          ? friends.map((f, i) => <FriendItem key={i} user={f} />)
          : requests.map((r, i) => <FriendRequestItem key={i} user={r} />)}
      </ScrollView>
    </View>
  )
}