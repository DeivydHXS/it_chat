import { StyleSheet, Text, View } from 'react-native';

import { Link } from 'expo-router';

export default function LoginScreen() {
  return (
    <View style={styles.titleContainer}>
      <View style={styles.stepContainer}>
        <Link href="/(tabs)">
          <Link.Trigger>
            <Text>Lofin</Text>
          </Link.Trigger>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
    height: '100%',
    backgroundColor: '#D51917',
  },
  stepContainer: {
    gap: 8,
    height: '75%',
    backgroundColor: '#F8F9FE',
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
