import { CustomPressable } from '@/components/custom-pressable'
import { InfoSection } from '@/components/info-section'
import { BaseSection } from '@/components/register-form/base-section'
import { ImageSection } from '@/components/register-form/image-section'
import { mainStyles } from '@/constants/theme'
import { useApi } from '@/hooks/use-api'
import { ResponseInterface } from '@/interfaces/common-interfaces'
import { useState, useCallback, useMemo } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import { GroupsItem } from '@/components/groups-item'

interface GroupRegister {
    name: string
    description: string
    icon_image: DocumentPicker.DocumentPickerAsset | null
    cover_image: DocumentPicker.DocumentPickerAsset | null
}

export default function CreateScreen() {
    const { post } = useApi()
    const [codeError, setCodeError] = useState<string>('')
    const [canProceed, setCanProceed] = useState<boolean>(false)

    const steps = [
        'name',
        'description',
        'icon_image',
        'cover_image',
        'confirmation',
    ]

    const [form, setForm] = useState<GroupRegister>({
        name: '',
        description: '',
        icon_image: null,
        cover_image: null,
    })

    const [step, setStep] = useState<typeof steps[number]>('name')

    const handleForm = useCallback((newValue: string, field: keyof GroupRegister) => {
        setForm((prev) => {
            return { ...prev, [field]: newValue }
        })

        if (newValue.length > 0) {
            setCanProceed(true)
        } else {
            setCanProceed(false)
        }
    }, [setCanProceed, setForm])

    const handleImageForm = useCallback((newValue: DocumentPicker.DocumentPickerAsset | null, field: keyof GroupRegister) => {
        setForm((prev) => {
            return { ...prev, [field]: newValue }
        })

        if (newValue) {
            setCanProceed(true)
        } else {
            setCanProceed(false)
        }
    }, [setCanProceed, setForm, form])

    const submitStep = useCallback(async () => {
        setStep(prev => {
            const currentIndex = steps.findIndex(item => item === prev)
            const nextStep = steps[currentIndex + 1]
            if (!nextStep) return prev
            return nextStep
        })
        setCanProceed(false)
    }, [setCanProceed])

    const handleCreate = useCallback(async () => {
        try {
            const response = await post<ResponseInterface>('/groups', form)

            if (response.status > 299) {
                Alert.alert(response?.data?.message, JSON.stringify(response?.data?.errors))
                return
            }

            Alert.alert(
                'Grupo criado com sucesso!',
                response?.data?.message
            )
        } catch (err: any) {
            Alert.alert('Erro', err.response?.data?.message || JSON.stringify(err))
        }
    }, [form])

    const renderButton = useMemo((): { text: string, action: () => Promise<void> } => {
        switch (step) {
            case 'icon_image': return {
                text: 'Adicionar imagem',
                action: submitStep
            }
            case 'cover_image': return {
                text: 'Adicionar imagem',
                action: submitStep
            }
            case 'confirmation': return {
                text: 'Confirmar',
                action: handleCreate
            }
            default: return {
                text: 'Avançar',
                action: submitStep
            }
        }
    }, [step, handleForm])

    return (
        <View style={mainStyles.container_alt}>
            {step === 'name' && (
                <BaseSection
                    head='Escolha um nome para o grupo'
                    body="Insira um nome que reflita o objetivo do grupo. Isso ajuda as pessoas a encontrar essa comunidade."
                    button_text='Digite o nome do grupo'
                    max_length={25}
                    showCounter={true}
                    value={form.name}
                    handle={(text) => handleForm(text, 'name')}
                />
            )}

            {step === 'description' && (
                <BaseSection
                    head='Escreva a descrição do grupo'
                    body='Escreva uma breve apresentação do grupo. Qual seu foco e motivação em criar-lo. Essa descrição aparecerá quando um usuário estiver explorando novos grupos.'
                    max_length={200}
                    showCounter={true}
                    isTextArea={true}
                    value={form.description}
                    handle={(text) => handleForm(text, 'description')}
                />
            )}

            {step === 'icon_image' && (
                <View style={styles.container}>
                    <ImageSection
                        head='Escolha um ícone para o grupo'
                        body='Escolha um ícone para o grupo. Se preferir, pode escolher o ícone mais tarde.'
                        value={form.icon_image}
                        setValue={(value) => {
                            handleImageForm(value, 'icon_image')
                        }}
                    />
                </View>
            )}

            {step === 'cover_image' && (
                <View style={styles.container}>
                    <ImageSection
                        head='Escolha uma imagem de capa'
                        body='Escolha uma imagem de capa. Se preferir, pode escolher a imagem de capa mais tarde.'
                        value={form.cover_image}
                        setValue={(value) => {
                            handleImageForm(value, 'cover_image')
                        }}
                    />
                </View>
            )}

            {step === 'confirmation' && (
                <View style={styles.container}>
                    <InfoSection
                        head='Só mais um passo...'
                        body='Confirme a criação do seu novo grupo.'
                    />
                    <GroupsItem
                        title={form.name}
                        description={form.description}
                        icon_image_url={form.icon_image?.uri || ''}
                        cover_image_url={form.cover_image?.uri || ''}
                    />
                </View>
            )}

            <CustomPressable
                disabled={step === 'confirmation' ? false : (!canProceed)}
                text={renderButton.text}
                onPress={renderButton.action}
            />
            {step !== 'name' && step !== 'confirmation' &&
                <CustomPressable
                    isAlt={true}
                    text='Pular'
                    onPress={submitStep}
                />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 16
    }
})