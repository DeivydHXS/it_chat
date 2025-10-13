import { Alert, Image, StyleSheet, Text, TextInput, View } from 'react-native';

import { Link, LinkTrigger, router } from 'expo-router';
import icon_img from '../../assets/images/logo-it.png';
import { useCallback, useContext, useEffect, useState } from 'react';
import { CustomInputText } from '@/components/custom-input-text';
import { CustomLink } from '@/components/custom-link';
import { InfoSection } from '@/components/info-section';
import { mainStyles } from '@/constants/theme';
import { CustomPressable } from '@/components/custom-pressable';
import { AuthContext } from '@/context/auth-context';
import { LoginInterface } from '@/interfaces/common-interfaces';
import { useApi } from '@/hooks/use-api';

export default function LoginScreen() {
  const { post } = useApi()
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email: string, password: string }>()

  const handleLogin = useCallback(async () => {
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
  }, [email, password])

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
        onChangeText={(text) => {
          setErrors((prev) => {
            return {
              password: prev?.password || '',
              email: ''
            }
          })
          setEmail(text)
        }}
        error={errors?.email}
      />

      <CustomInputText
        placeholder='Digite sua senha'
        value={password}
        secureTextEntry
        onChangeText={(text) => {
          setErrors((prev) => {
            return {
              password: '',
              email: prev?.email || ''
            }
          })
          setPassword(text)
        }}
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
