
import { CustomPressable } from '@/components/custom-pressable';
import { MenuCustomPressable } from '@/components/menu-custom-pressable';
import { Colors, mainStyles } from '@/constants/theme';
import { AuthContext } from '@/context/auth-context';
import { useApi } from '@/hooks/use-api';
import { MaterialIcons } from '@expo/vector-icons';
import { navigate, replace } from 'expo-router/build/global-state/routing';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function TabFourScreen() {
  const baseURL = process.env.EXPO_PUBLIC_API_URL
  const { user, getUser, logout } = useContext(AuthContext);
  const { del } = useApi()
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    getUser();
  }, []);

  const logoutUser = useCallback(async () => {
    await logout()
    replace('/(wellcome)/login')
  }, [])

  const handleDelete = useCallback(async () => {
    await del('/me')
    await logout()
    replace('/(wellcome)/login')
  }, [])

  return (
    <>
      <View style={mainStyles.main_container}>
        <View style={styles.profile_image}>
          {user?.profile_image_url ?
            <Image
              source={{ uri: baseURL + user?.profile_image_url }}
              style={{ width: 100, height: 100 }}
            /> :
            <MaterialIcons name="person" size={120} color={'#B4DBFF'} style={{
              right: 9
            }} />
          }
        </View>

        <View style={styles.name_container}>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.nickname}>{user?.nickname}#{user?.nickname_hash}</Text>
        </View>

        <View style={styles.bio}>
          <Text style={{
            color: Colors.gray3
          }}>{user?.bio}</Text>
        </View>

        <View style={styles.options}>
          <MenuCustomPressable onPress={() => navigate('/(tabs)/(profile)/edit')} text='Editar perfil' />
          <MenuCustomPressable onPress={() => navigate('/(tabs)/(profile)/change-password')} text='Alterar senha' />
          <MenuCustomPressable onPress={() => setOpen(true)} text='Excluir conta' />
          <MenuCustomPressable onPress={() => logoutUser()} text='Sair' />
        </View>
      </View>
      {
        open &&
        <View style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <View style={{
            width: '70%',
            gap: 8,
            backgroundColor: Colors.light,
            borderRadius: 24,
            alignItems: 'center',
            paddingVertical: 24,
            paddingHorizontal: 20,
            borderWidth: 1,
            borderColor: Colors.gray4
          }}>
            <View style={{
              marginBottom: 8,
              alignItems: 'center'
            }}>
              <Text style={{
                fontWeight: 'bold',
                fontSize: 18
              }}>Atenção</Text>
              <Text>Deseja realmente excluir sua conta?</Text>
            </View>
            <CustomPressable text='Confirmar' onPress={handleDelete}>
            </CustomPressable>
            <CustomPressable isAlt={true} text='Cancelar' onPress={() => setOpen(false)}>
            </CustomPressable>
          </View>
        </View>
      }
    </>
  );
}

const styles = StyleSheet.create({
  profile_image: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF2FF',
    borderRadius: 50,
    overflow: 'hidden'
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
    color: Colors.gray3,
    fontSize: 16
  },
  bio: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.gray4,
    padding: 16
  },
  options: {
    width: '100%',
    gap: 2
  }
})