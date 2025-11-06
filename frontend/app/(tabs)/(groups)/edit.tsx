
import { CustomInputLargeText } from '@/components/custom-input-large-text'
import { CustomInputText } from '@/components/custom-input-text'
import { CustomPressable } from '@/components/custom-pressable'
import { InfoSection } from '@/components/info-section'
import { Colors, mainStyles } from '@/constants/theme'
import { useApi } from '@/hooks/use-api'
import { MaterialIcons } from '@expo/vector-icons'
import { goBack } from 'expo-router/build/global-state/routing'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Animated, Easing, Image, Keyboard, Platform, Pressable, StyleSheet, Text, View, ScrollView } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import { Loading } from '@/components/loading'
import { ChatInterface, ChatUpdateErrors } from '@/interfaces/chat-interfaces'
import { useLocalSearchParams } from 'expo-router'

export default function EditScreen() {
  const { get, post } = useApi()
  const baseURL = process.env.EXPO_PUBLIC_API_URL
  const [load, setLoad] = useState<boolean>(false)
  const translateY = useRef(new Animated.Value(0)).current
  const [errors, setErrors] = useState<ChatUpdateErrors>()

  const { groupId } = useLocalSearchParams()

  const [group, setGroup] = useState<ChatInterface>()
  const [iconImage, setIconImage] = useState<DocumentPicker.DocumentPickerAsset | null>(null)
  const [iconImageUrl, setIconImageUrl] = useState<string | null>(null)
  const [coverImage, setCoverImage] = useState<DocumentPicker.DocumentPickerAsset | null>(null)
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)

  const getGroup = useCallback(async () => {
    const res = await get<{ data: { group: ChatInterface } }>(`/groups/${groupId}`)
    setGroup(res.data.data.group)
  }, [])

  useEffect(() => {
    getGroup()
  }, [])

  const [form, setForm] = useState<ChatUpdateErrors>({
    name: group?.name || '',
    description: group?.description || '',
  })

  useEffect(() => {
    setForm({
      name: group?.name,
      description: group?.description
    })
    setIconImageUrl(group?.icon_image_url || null)
    setCoverImageUrl(group?.cover_image_url || null)
  }, [group])

  const pickIconImage = async () => {
    setLoad(true)
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true
      })

      if (result.canceled === false) {
        setIconImage(result.assets[0])
      }
    } catch (err) {
      console.error("Erro ao selecionar documento: ", err)
    } finally {
      setTimeout(() => {
        setLoad(false)
      }, 500)
    }
  }

  const pickCoverImage = async () => {
    setLoad(true)
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true
      })

      if (result.canceled === false) {
        setCoverImage(result.assets[0])
      }
    } catch (err) {
      console.error("Erro ao selecionar documento: ", err)
    } finally {
      setTimeout(() => {
        setLoad(false)
      }, 500)
    }
  }

  const handleDeleteIconImage = useCallback(async () => {
    setIconImageUrl(null)
    setIconImage(null)
    setForm(prev => {
      return {
        ...prev,
        remove_icon: 'true'
      }
    })
  }, [])

  const handleDeleteCoverImage = useCallback(async () => {
    setCoverImageUrl(null)
    setCoverImage(null)
    setForm(prev => {
      return {
        ...prev,
        remove_cover: 'true'
      }
    })
  }, [])

  const handleForm = useCallback((newValue: string, field: keyof ChatUpdateErrors) => {
    setForm((prev) => {
      return { ...prev, [field]: newValue }
    })
  }, [setForm])

  const handleUpdate = useCallback(async () => {
    setLoad(true)
    try {
      const data = new FormData()

      if (form.name) {
        data.append("name", form.name)
      }

      if (form.description) {
        data.append("description", form.description)
      }

      if (iconImage) {
        data.append("icon_image", {
          uri: iconImage.uri,
          name: iconImage.name || "iconImage.jpg",
          type: iconImage.mimeType || "image/jpeg",
        } as any)
      } else if (form.remove_icon) {
        data.append("remove_icon", "true")
      }

      if (coverImage) {
        data.append("cover_image", {
          uri: coverImage.uri,
          name: coverImage.name || "coverImage.jpg",
          type: coverImage.mimeType || "image/jpeg",
        } as any)
      } else if (form.remove_cover) {
        data.append("remove_cover", "true")
      }

      const response = await post<{ data?: { group: ChatInterface }, errors: ChatUpdateErrors }>(`/groups/${group?.id}`, data, true)

      if (!response) {
        Alert.alert("Erro", "Erro interno")
        return
      }

      if (response.status > 299) {
        setErrors(response.data.errors)
        return
      }

      setGroup(response.data.data?.group)
      goBack()
    } catch (err: any) {
      Alert.alert("Erro", "Erro inesperado")
    } finally {
      setLoad(false)
    }
  }, [form, iconImage, coverImage])

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
        transform: [{ translateY: Animated.multiply(translateY, -0.6) }],
      }}
    >
      <ScrollView>
        <View style={mainStyles.main_container}>
          {load ?
            <Loading />
            :
            <>
              <InfoSection
                head='Mude as informações do grupo'
                body='Essa area é voltada para a atualização das informações do grupo.'
              />

              <View style={{
                width: '100%',
              }}>
                <View style={{
                  position: 'relative'
                }}>
                  <View style={styles.cover_image}>
                    {coverImage || coverImageUrl ?
                      <Image
                        source={{ uri: coverImage ? coverImage.uri : String(baseURL) + coverImageUrl }}
                        style={{ width: '100%', height: 200 }}
                      />
                      :
                      coverImageUrl ?
                        <Image
                          source={{ uri: baseURL + coverImageUrl }}
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
                    bottom: -16,
                    borderRadius: 50,
                    width: 32,
                    height: 32,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: Colors.red
                  }}>
                    <Pressable onPress={pickCoverImage}><MaterialIcons name="edit" size={16} color={Colors.light} /></Pressable>
                  </View>

                  {coverImage || coverImageUrl ?
                    <View style={{
                      position: 'absolute',
                      right: 48,
                      bottom: -16,
                      borderRadius: 50,
                      width: 32,
                      height: 32,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: Colors.red
                    }}>
                      <Pressable onPress={handleDeleteCoverImage}><MaterialIcons name="delete" size={16} color={Colors.light} /></Pressable>
                    </View>
                    : ''
                  }

                </View>
                <View>
                  <Text style={styles.icon_image_error}>{errors?.icon_image_url ? errors.icon_image_url : ''}</Text>
                </View>
              </View>

              <View style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <View style={{
                  position: 'relative'
                }}>
                  <View style={styles.icon_image}>
                    {iconImage || iconImageUrl ?
                      <Image
                        source={{ uri: iconImage ? iconImage.uri : String(baseURL) + iconImageUrl }}
                        style={{ width: 100, height: 100 }}
                      />
                      :
                      iconImageUrl ?
                        <Image
                          source={{ uri: baseURL + iconImageUrl }}
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
                    <Pressable onPress={pickIconImage}><MaterialIcons name="edit" size={16} color={Colors.light} /></Pressable>
                  </View>

                  {iconImage || iconImageUrl ?
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
                      <Pressable onPress={handleDeleteIconImage}><MaterialIcons name="delete" size={16} color={Colors.light} /></Pressable>
                    </View>
                    : ''
                  }

                </View>
                <View>
                  <Text style={styles.icon_image_error}>{errors?.icon_image_url ? errors.icon_image_url : ''}</Text>
                </View>
              </View>

              <CustomInputText
                error={errors?.name}
                placeholder='Digite um nome'
                value={form.name}
                onFocus={() => {
                  setErrors((prev) => ({ ...(prev || {}), name: undefined }))
                }}
                onChangeText={(text) => {
                  setErrors((prev) => ({ ...(prev || {}), name: undefined }))
                  handleForm(text, 'name')
                }}
                maxLength={25}
                showCounter={true}
              />

              <CustomInputLargeText
                error={errors?.description}
                placeholder='Escreva a descrição do grupo'
                value={form.description}
                onChangeText={(text) => {
                  setErrors((prev) => ({ ...(prev || {}), description: undefined }))
                  handleForm(text, 'description')
                }}
                maxLength={200}
                showCounter={true}
              />

              <CustomPressable
                text='Salvar'
                disabled={load}
                onPress={handleUpdate}
              />

              <View style={{
                height: 64
              }} />
            </>
          }
        </View>
      </ScrollView>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  cover_image: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF2FF',
  },
  icon_image: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF2FF',
    borderRadius: 50,
    overflow: 'hidden'
  },
  icon_image_error: {
    color: 'red',
    fontSize: 12
  }
})