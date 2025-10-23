
import { CustomInputLargeText } from '@/components/custom-input-large-text'
import { CustomInputText } from '@/components/custom-input-text'
import { CustomPressable } from '@/components/custom-pressable'
import { InfoSection } from '@/components/info-section'
import { Colors, mainStyles } from '@/constants/theme'
import { AuthContext } from '@/context/auth-context'
import { useApi } from '@/hooks/use-api'
import { UserUpdateResponse } from '@/interfaces/common-interfaces'
import { UserUpdateErrors, UserUpdateForm } from '@/interfaces/user-interfaces'
import { MaterialIcons } from '@expo/vector-icons'
import { goBack } from 'expo-router/build/global-state/routing'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Alert, Animated, Easing, Image, Keyboard, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'

export default function EditScreen() {
  const { post } = useApi()
  const baseURL = process.env.EXPO_PUBLIC_API_URL
  const { user, setUser } = useContext(AuthContext)

  const [errors, setErrors] = useState<UserUpdateErrors>()
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null)
  const [profileImageUrlTemp, setProfileImageUrlTemp] = useState<string | null>(null)
  const [load, setLoad] = useState<boolean>(false)
  const translateY = useRef(new Animated.Value(0)).current

  const pickDocument = async () => {
    setLoad(true)
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
    } finally {
      setTimeout(() => {
        setLoad(false)
      }, 500)
    }
  }

  const [form, setForm] = useState<UserUpdateForm>({
    name: user?.name || '',
    nickname: user?.nickname || '',
    bio: user?.bio || ''
  })

  useEffect(() => {
    setProfileImageUrlTemp(user?.profile_image_url || null)
  }, [user])

  const handleDeleteProfileImage = useCallback(async () => {
    setProfileImageUrlTemp(null)
    setFile(null)
  }, [])

  const handleForm = useCallback((newValue: string, field: keyof UserUpdateForm) => {
    setForm((prev) => {
      return { ...prev, [field]: newValue }
    })
  }, [])

  const handleUpdate = useCallback(async () => {
    setLoad(true)
    try {
      const data = new FormData()

      data.append("name", form.name)
      data.append("nickname", form.nickname)

      if (form.bio) {
        data.append("bio", form.bio)
      }

      if (file) {
        data.append("profile_image", {
          uri: file.uri,
          name: file.name || "profile.jpg",
          type: file.mimeType || "image/jpeg",
        } as any)
      }

      const response = await post<UserUpdateResponse>('/me', data, true)

      if (!response) {
        Alert.alert("Erro", "Erro interno")
        return
      }

      if (response.status > 299) {
        setErrors(response.data.errors)
        return
      }

      setUser(response.data.data?.user)
      goBack()
    } catch (err: any) {
      Alert.alert("Erro", "Erro inesperado")
    } finally {
      setLoad(false)
    }
  }, [form, file])


  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
        Animated.timing(translateY, {
          toValue: event.endCoordinates.height,
          duration: 200,
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
          duration: 200,
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

  return (
    <Animated.View
      style={{
        position: 'absolute',
        height: '100%',
        left: 0,
        right: 0,
        top: 0,
        transform: [{ translateY: Animated.multiply(translateY, -0.5) }],
      }}
    >
      <View style={mainStyles.main_container}>
        <InfoSection
          head='Mude suas informações'
          body='Essa area é voltada para a atualização de suas informações básicas.'
        />

        <View style={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <View style={{
            position: 'relative'
          }}>
            <View style={styles.profile_image}>
              {file || profileImageUrlTemp ?
                <Image
                  source={{ uri: file ? file.uri : String(baseURL) + profileImageUrlTemp }}
                  style={{ width: 100, height: 100 }}
                />
                :
                profileImageUrlTemp ?
                  <Image
                    source={{ uri: baseURL + profileImageUrlTemp }}
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

            {file || profileImageUrlTemp ?
              <View style={{
                position: 'absolute',
                right: 1,
                top: 1,
                borderRadius: 50,
                width: 32,
                height: 32,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: Colors.red
              }}>
                <Pressable onPress={handleDeleteProfileImage}><MaterialIcons name="delete" size={16} color={Colors.light} /></Pressable>
              </View>
              : ''
            }

          </View>
          <View>
            <Text style={styles.profile_image_error}>{errors?.profile_image ? errors.profile_image : ''}</Text>
          </View>
        </View>

        <CustomInputText error={errors?.name} placeholder='Digite um nome' value={form.name} onChangeText={(text) => {
          setErrors((prev) => ({ ...(prev || {}), name: undefined }))
          handleForm(text, 'name')
        }} />

        <View style={{
          width: '100%'
        }}>
          <CustomInputText error={errors?.nickname} placeholder='Digite um nome de usuário' value={form.nickname} onChangeText={(text) => {
            setErrors((prev) => ({ ...(prev || {}), nickname: undefined }))
            handleForm(text, 'nickname')
          }} />
          <View style={{
            height: 50,
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
          setErrors((prev) => ({ ...(prev || {}), bio: undefined }))
          handleForm(text, 'bio')
        }} />

        <CustomPressable
          text='Salvar'
          disabled={load}
          onPress={handleUpdate}
        />
      </View>
    </Animated.View>
  )
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
  profile_image_error: {
    color: 'red',
    fontSize: 12
  }
})