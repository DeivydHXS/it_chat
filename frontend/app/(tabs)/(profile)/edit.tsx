
import { Colors } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

export default function TabFourScreen() {
  return (
    <View style={styles.container}>
        <Text>Edit</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 48,
    gap: 16,
  },
})