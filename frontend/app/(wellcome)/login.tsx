import { Alert, Image, StyleSheet, Text, TextInput, View } from 'react-native';

import { Link, LinkTrigger, router } from 'expo-router';
import icon_img from '../../assets/images/logo-it.png';
import { useContext, useState } from 'react';
import { CustomInputText } from '@/components/custom-input-text';
import { CustomLink } from '@/components/custom-link';
import { InfoSection } from '@/components/info-section';
import { mainStyles } from '@/constants/theme';
import api from '@/services/api';
import { AuthStorageService } from '@/services/authStorageService';
import { CustomPressable } from '@/components/custom-pressable';
import { TokenInterface, UserInterface } from '@/interfaces/user-interfaces';
import { AuthContext } from '@/context/auth-context';
import { LoginInterface, ResponseInterface } from '@/interfaces/common-interfaces';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doLogin } = useContext(AuthContext)

  async function handleLogin() {
    try {
      const response = await api.post<LoginInterface>('/auth/login', { email, password });
      await doLogin(response.data.data?.user, response.data.data?.token);
      router.replace('/(tabs)');
    } catch (err) {
      Alert.alert('Erro', 'Email ou senha incorretos.');
    }
  }
  
  return (
    <View style={mainStyles.container}>
      <Image source={icon_img} style={styles.image_container} />

      <InfoSection
        head='Faça login'
        body='Informe seu e-mail e senha para realizar o login.'
      />

      <CustomInputText
        placeholder='Digite seu email'
        value={email}
        onChangeText={setEmail}
      />

      <CustomInputText
        placeholder='Digite sua senha'
        value={password}
        onChangeText={setPassword}
      />

      <CustomPressable
        text='Login'
        onPress={handleLogin}
      />

      <CustomLink
        to='/register'
        text='Registre-se'
        isAlt={true}
      />

      <View style={{
        flexDirection: 'row',
        gap: 4,
        marginTop: 32
      }}>
        <Text>
          Esqueceu sua senha?
        </Text>

        <Link href='/'>
          <LinkTrigger>
            <Text style={{
              fontWeight: 'bold'
            }}>Clique aqui.</Text>
          </LinkTrigger>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image_container: {
    width: 200,
    height: 200,
    marginBottom: 16
  }
});
