import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { InfoSection } from "../info-section";
import { useCallback, useState } from "react";
import * as DocumentPicker from 'expo-document-picker'
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";

interface ImageSectionProps {
    value: DocumentPicker.DocumentPickerAsset | null
    setValue: (value: DocumentPicker.DocumentPickerAsset | null) => void
    error?: string
    head?: string
    body?: string
}

export function ImageSection(props: ImageSectionProps) {
    const baseURL = process.env.EXPO_PUBLIC_API_URL
    const [load, setLoad] = useState<boolean>(false)

    const pickDocument = async () => {
        setLoad(true)
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "image/*",
                copyToCacheDirectory: true
            })

            if (result.canceled === false) {
                props.setValue(result.assets[0])
            }

        } catch (err) {
            console.error("Erro ao selecionar documento: ", err)
        } finally {
            setTimeout(() => {
                setLoad(false)
            }, 500)
        }
    }

    const handleDeleteProfileImage = useCallback(async () => {
        props.setValue(null)
    }, [])

    return (
        <View style={styles.container}>
            <InfoSection
                head={props.head || ''}
                body={props.body || ''}
            />

            <View style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <View style={{
                    position: 'relative'
                }}>
                    <View style={styles.image}>
                        {props.value ?
                            <Image
                                source={{ uri: props.value.uri }}
                                style={{ width: 100, height: 100 }}
                            />
                            :
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
                        <Pressable onPress={pickDocument}>
                            <MaterialIcons name="edit" size={16} color={Colors.light} />
                        </Pressable>
                    </View>

                    {props.value ?
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
                            <Pressable onPress={handleDeleteProfileImage}>
                                <MaterialIcons name="delete" size={16} color={Colors.light} />
                            </Pressable>
                        </View>
                        : ''
                    }
                </View>

                <View>
                    <Text style={styles.image_error}>{props.error || ''}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 16
    },
    image: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EAF2FF',
        borderRadius: 50,
        overflow: 'hidden'
    },
    image_error: {
        color: 'red',
        fontSize: 12
    }
})