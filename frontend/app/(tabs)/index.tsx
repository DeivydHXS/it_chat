import { SearchBar } from '@/components/search-bar';
import { Colors, mainStyles } from '@/constants/theme';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TabOneScreen() {
  const [search, setSearch] = useState('')

  return (
    <View style={mainStyles.main_container}>
      <SearchBar value={search} onChange={setSearch} />
    </View>
  );
}

const styles = StyleSheet.create({

})