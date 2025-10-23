import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Link, LinkTrigger, router, usePathname } from 'expo-router';
import icon_img from '../../assets/images/logo-it.png';
import { useCallback, useContext, useEffect, useState } from 'react';
import { CustomInputText } from '@/components/custom-input-text';
import { CustomLink } from '@/components/custom-link';
import { InfoSection } from '@/components/info-section';
import { Colors, mainStyles } from '@/constants/theme';
import { CustomPressable } from '@/components/custom-pressable';
import { AuthContext } from '@/context/auth-context';
import { LoginInterface } from '@/interfaces/common-interfaces';
import { useApi } from '@/hooks/use-api';
import { StorageService } from '../../services/storageService';
import { MaterialIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const { post } = useApi();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email: string; password: string }>();
  const [modal, setModal] = useState<boolean>(false);

  const handleLogin = useCallback(async () => {
    try {
      const response = await post<LoginInterface>('/auth/login', { email, password });
      if (response.status > 299) {
        setErrors(response.data.errors);
        return;
      }

      // @ts-ignore
      await login(response.data.data?.user, response.data.data?.token);
      router.replace('/(tabs)');
    } catch (err) {
      Alert.alert('Erro', JSON.stringify(err));
    }
  }, [email, password]);

  const setFirst = useCallback(async () => {
    await StorageService.setFirst(true);
  }, []);

  useEffect(() => {
    setFirst();
  }, []);

  const usersData = [
    { email: 'alice@email.com', password: 'Password123!' },
    { email: 'bob@email.com', password: 'Password123!' },
    { email: 'carol@email.com', password: 'Password123!' },
    { email: 'dave@email.com', password: 'Password123!' },
    { email: 'eve@email.com', password: 'Password123!' },
    { email: 'superdev@email.com', password: 'SuperDEV1@' },
    { email: 'superqa@email.com', password: 'SuperQA1@' },
  ];

  const handleQuickLogin = useCallback(async (email: string, password: string) => {
    try {
      const response = await post<LoginInterface>('/auth/login', { email, password });
      // @ts-ignore
      await login(response.data.data?.user, response.data.data?.token);
      router.replace('/(tabs)');
    } catch (err) {
      Alert.alert('Erro', JSON.stringify(err));
    }
  }, []);

  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/login') {
      setErrors({ email: '', password: '' });
    }
  }, [pathname]);

  return (
    <View style={mainStyles.container}>
      <Image source={icon_img} style={styles.image_container} />

      <InfoSection
        head="Faça login"
        body="Informe seu e-mail e senha para realizar o login."
      />

      <CustomInputText
        placeholder="Digite seu email"
        value={email}
        onChangeText={(text) => {
          setErrors((prev) => ({ password: prev?.password || '', email: '' }));
          setEmail(text);
        }}
        error={errors?.email}
      />

      <CustomInputText
        placeholder="Digite sua senha"
        value={password}
        secureTextEntry
        onChangeText={(text) => {
          setErrors((prev) => ({ password: '', email: prev?.email || '' }));
          setPassword(text);
        }}
        error={errors?.password}
      />

      <CustomPressable text="Login" onPress={handleLogin} />

      <CustomLink to="/register" text="Registre-se" isAlt={true} />

      <View style={{ flexDirection: 'row', gap: 4, marginTop: 32 }}>
        <Text>Esqueceu sua senha?</Text>
        <Link href="/forgot-password">
          <LinkTrigger>
            <Text style={{ fontWeight: 'bold' }}>Clique aqui.</Text>
          </LinkTrigger>
        </Link>
      </View>

      <View style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        marginTop: 64,
        alignItems: 'center'
      }}>
        <View style={{
          width: '100%',
          alignItems: 'flex-end'
        }}>
          <Pressable onPress={() => setModal(!modal)} style={{
            padding: 8,
            borderRadius: 16,
            backgroundColor: Colors.red,
            width: 48,
            height: 48,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <MaterialIcons size={32} color={Colors.light} name='list' />
          </Pressable>
        </View>
        {modal &&
          <View style={{
            backgroundColor: Colors.light,
            borderRadius: 16,
            width: '80%',
            padding: 16,
            gap: 8
          }}>
            {usersData.map((user) => (
              <Pressable
                key={user.email}
                style={{
                  backgroundColor: Colors.dark,
                  height: 40,
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 24,
                }}
                onPress={() => handleQuickLogin(user.email, user.password)}
              >
                <Text style={{ color: Colors.light, fontWeight: 'bold' }}>
                  {user.email.split('@')[0]}
                </Text>
              </Pressable>
            ))}
          </View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image_container: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
});
