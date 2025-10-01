import { Alert, Image, StyleSheet, Text, TextInput, View } from 'react-native';

import { Link, LinkTrigger, router } from 'expo-router';
import icon_img from '../../assets/images/logo-it.png';
import { useContext, useState } from 'react';
import { CustomInputText } from '@/components/custom-input-text';
import { CustomLink } from '@/components/custom-link';
import { InfoSection } from '@/components/info-section';
import { mainStyles } from '@/constants/theme';
import api from '@/services/api';
import { CustomPressable } from '@/components/custom-pressable';
import { AuthContext } from '@/context/auth-context';
import { LoginInterface, ResponseInterface } from '@/interfaces/common-interfaces';
import { useApi } from '@/hooks/use-api';

export default function LoginScreen() {
  const { post } = useApi()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext)
  const [errors, setErrors] = useState<{ email: string, password: string }>()

  async function handleLogin() {
    try {
      const response = await post<LoginInterface>('/auth/login', { email, password });

      if (response.status > 299) {
        setErrors(response.data.errors)
        return
      }

      // @ts-ignore
      await login(response.data.data?.user, response.data.data?.token);
      router.replace('/(tabs)')
    } catch (err) {
      Alert.alert('Erro', JSON.stringify(err));
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
        error={errors?.email}
      />

      <CustomInputText
        placeholder='Digite sua senha'
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        error={errors?.password}
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

        <Link href='/forgot-password'>
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
