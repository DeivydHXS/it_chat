import { Alert, Animated, Easing, Image, Keyboard, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Link, LinkTrigger, router, usePathname } from 'expo-router';
import icon_img from '../../assets/images/logo-it.png';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
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
  const translateY = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
        Animated.timing(translateY, {
          toValue: event.endCoordinates.height,
          duration: 250,
          useNativeDriver: false,
          easing: Easing.out(Easing.ease),
        }).start()
      }
    )

    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
          easing: Easing.out(Easing.ease),
        }).start()
      }
    )

    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [translateY])

  const handleLogin = useCallback(async () => {
    try {
      const response = await post<LoginInterface>('/auth/login', { email, password });
      if (response.status > 299) {
        Alert.alert(response.data.message)
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

  const emails = [
    'davi@email.com',
    'deivyd@email.com',
    'diego@email.com',
    'edu@email.com',
    'maikon@email.com',
    'pam@email.com'
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
    <Animated.View
      style={{
        width: '100%',
        transform: [{ translateY: Animated.multiply(translateY, -0.4) }],
      }}
    >
      <View style={mainStyles.container}>
        <Image source={icon_img} style={styles.image_container} />

        <InfoSection
          head="Faça login"
          body="Informe seu e-mail e senha para realizar o login."
        />
        <CustomInputText
          placeholder="Digite seu email"
          value={email}
          onFocus={() => {
            setErrors((prev) => ({ password: prev?.password || '', email: '' }));
          }}
          onChangeText={(text) => {
            setErrors((prev) => ({ password: prev?.password || '', email: '' }));
            setEmail(text);
          }}
          error={errors?.email}
          maxLength={100}
        />

        <CustomInputText
          placeholder="Digite sua senha"
          value={password}
          secureTextEntry
          onFocus={() => {
            setErrors((prev) => ({ password: '', email: prev?.email || '' }));
          }}
          onChangeText={(text) => {
            setErrors((prev) => ({ password: '', email: prev?.email || '' }));
            setPassword(text);
          }}
          error={errors?.password}
          maxLength={30}
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
              {emails.map((email) => (
                <Pressable
                  key={email}
                  style={{
                    backgroundColor: Colors.dark,
                    height: 40,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 24,
                  }}
                  onPress={() => handleQuickLogin(email, 'Senha123@')}
                >
                  <Text style={{ color: Colors.light, fontWeight: 'bold' }}>
                    {email.split('@')[0]}
                  </Text>
                </Pressable>
              ))}
            </View>}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  image_container: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
});
