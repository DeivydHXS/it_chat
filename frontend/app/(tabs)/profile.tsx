
import { Colors } from '@/constants/theme';
import { AuthContext } from '@/context/auth-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function TabFourScreen() {
  const baseURL = process.env.API_URL || 'http:/192.168.1.6:3333'
  const { user, getUser } = useContext(AuthContext);

  useEffect(() => {
    getUser();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.profile_image}>
        {user?.profile_image_url ?
          <Image
            source={{ uri: baseURL + user?.profile_image_url }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          /> :
          <MaterialIcons name="person" size={100} color={'#B4DBFF'} />
        }
      </View>

      <View style={styles.name_container}>
        <Text style={styles.name}>{user?.name}</Text>
        <Text>{user?.nickname}#{user?.nickname_hash}</Text>
      </View>

      <View style={styles.bio}>
        <Text>{user?.bio}</Text>
      </View>

      <View style={styles.options}>
        <View style={styles.option_item}>
          <Text>Editar perfil</Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={Colors.red}
          />
        </View>
        <View style={styles.option_item}>
          <Text>Alterar senha</Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={Colors.red}
          />
        </View>
        <View style={styles.option_item}>
          <Text>Excluir conta</Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={Colors.red}
          />
        </View>
      </View>
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
  profile_image: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF2FF',
    borderRadius: 50,
  },
  name_container: {
    alignItems: 'center',
    gap: 2
  },
  name: {
    color: Colors.dark,
    fontWeight: 'bold',
    fontSize: 22
  },
  nickname: {
    color: Colors.gray4,
    fontSize: 18
  },
  bio: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.gray3,
    padding: 16
  },
  options: {
    width: '100%',
    gap: 2
  },
  option_item: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})