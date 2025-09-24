import { Image, StyleSheet, Text, TextInput, View } from 'react-native';

import { Link, LinkTrigger } from 'expo-router';
import icon_img from '../../assets/images/logo-it.png';
import { useState } from 'react';
import { CustomInputText } from '@/components/custom-input-text';
import { CustomLink } from '@/components/custom-link';
import { InfoSection } from '@/components/info-section';
import { mainStyles } from '@/constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

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

      <CustomLink
        to='/(tabs)'
        text='Login'
        isAlt={false}
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
