import { SearchBar } from '@/components/search-bar';
import { Colors, mainStyles } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

export default function TabThreeScreen() {
  return (
    <View style={mainStyles.main_container}>
      <SearchBar
        value=''
        onChange={() => {}}
        />
    </View>
  );
}

const styles = StyleSheet.create({
})