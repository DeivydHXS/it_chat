
import { CustomInputLargeText } from '@/components/custom-input-large-text'
import { CustomInputText } from '@/components/custom-input-text'
import { CustomPressable } from '@/components/custom-pressable'
import { InfoSection } from '@/components/info-section'
import { Colors } from '@/constants/theme'
import { AuthContext } from '@/context/auth-context'
import { useApi } from '@/hooks/use-api'
import { UserUpdateResponse } from '@/interfaces/common-interfaces'
import { UserUpdateErrors, UserUpdateForm } from '@/interfaces/user-interfaces'
import { MaterialIcons } from '@expo/vector-icons'
import { goBack } from 'expo-router/build/global-state/routing'
import { useCallback, useContext, useEffect, useState } from 'react'
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'

export default function EditScreen() {
  const { post } = useApi()
  const baseURL = process.env.EXPO_PUBLIC_BASE_API_URL
  const { user, setUser } = useContext(AuthContext)

  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null)

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true
      })

      if (result.canceled === false) {
        setFile(result.assets[0])
      }
    } catch (err) {
      console.error("Erro ao selecionar documento: ", err)
    }
  }

  const [form, setForm] = useState<UserUpdateForm>({
    name: user?.name || '',
    nickname: user?.nickname || '',
    bio: user?.bio || ''
  })

  const [errors, setErrors] = useState<UserUpdateErrors>()

  const handleForm = useCallback((newValue: string, field: keyof UserUpdateForm) => {
    setForm((prev) => {
      return { ...prev, [field]: newValue }
    })
  }, [])

  const handleUpdate = useCallback(async () => {
    try {
      const data = new FormData();

      data.append("name", form.name);
      data.append("nickname", form.nickname);

      if (form.bio) {
        data.append("bio", form.bio);
      }

      if (file) {
        data.append("profile_image", {
          uri: file.uri,
          name: file.name || "profile.jpg",
          type: file.mimeType || "image/jpeg",
        } as any);
      }

      const response = await post<UserUpdateResponse>('/me', data, true);

      if (response.status > 299) {
        setErrors(response.data.errors);
        return;
      }

      setUser(response.data.data?.user);
      goBack();
    } catch (err: any) {
      console.error("Erro no update:", err);
      Alert.alert("Erro", err.response?.data?.message || "Erro inesperado");
    }
  }, [form, file]);


  return (
    <View style={styles.container}>
      <InfoSection
        head='Mude suas informações'
        body='Essa area é voltada para a atualização de suas 
informações básicas.'
      />

      <View style={{
        position: 'relative'
      }}>
        <View style={styles.profile_image}>
          {file ?
            <Image
              source={{ uri: file.uri }}
              style={{ width: 100, height: 100 }}
            />
            :
            user?.profile_image_url ?
              <Image
                source={{ uri: baseURL + user?.profile_image_url }}
                style={{ width: 100, height: 100 }}
              /> :
              <MaterialIcons name="person" size={120} color={'#B4DBFF'} style={{
                right: 9
              }} />

          }
        </View>
        <View style={{
          position: 'absolute',
          right: 1,
          bottom: 1,
          borderRadius: 50,
          width: 32,
          height: 32,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors.red
        }}>
          <Pressable onPress={pickDocument}><MaterialIcons name="edit" size={16} color={Colors.light} /></Pressable>
        </View>
      </View>

      <CustomInputText error={errors?.name} placeholder='Digite um nome' value={form.name} onChangeText={(text) => {
        handleForm(text, 'name')
      }} />

      <View style={{
        width: '100%'
      }}>
        <CustomInputText error={errors?.nickname} placeholder='Digite um nome de usuário' value={form.nickname} onChangeText={(text) => {
          handleForm(text, 'nickname')
        }} />
        <View style={{
          height: '100%',
          position: 'absolute',
          alignSelf: 'flex-end',
          justifyContent: 'center',
          borderLeftWidth: 1,
          borderColor: Colors.gray3,
          padding: 16
        }}>
          <Text style={{
            color: Colors.gray3,
            fontSize: 16
          }}>#{user?.nickname_hash}</Text>
        </View>
      </View>

      <CustomInputLargeText error={errors?.bio} placeholder='Escreva sua bio' value={form.bio} onChangeText={(text) => {
        handleForm(text, 'bio')
      }} />

      <CustomPressable
        text='Salvar'
        onPress={handleUpdate}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 16,
  },
  profile_image: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF2FF',
    borderRadius: 50,
    overflow: 'hidden'
  }
})