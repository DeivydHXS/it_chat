import { CustomPressable } from '@/components/custom-pressable'
import { BaseSection } from '@/components/register-form/base-section'
import { PasswordSection } from '@/components/register-form/password-section'
import { mainStyles } from '@/constants/theme'
import { useApi } from '@/hooks/use-api'
import { ForgotPasswordResponseInterface, IsEmailValidResponse, ResponseInterface } from '@/interfaces/common-interfaces'
import { UserRegister } from '@/interfaces/user-interfaces'
import { goBack } from 'expo-router/build/global-state/routing'
import { useState, useCallback, useMemo } from 'react'
import { Alert, View } from 'react-native'

export default function ChangePasswordScreen() {
    const { post } = useApi()
    const [emailError, setEmailError] = useState<string>('')
    const [codeError, setCodeError] = useState<string>('')
    const [canProceed, setCanProceed] = useState<boolean>(false)

    const [form, setForm] = useState<{
        password: string,
        password_confirmation: string
    }>({
        password: '',
        password_confirmation: '',
    })

    const handleForm = useCallback((newValue: string, field: keyof UserRegister) => {
        setForm((prev) => {
            return { ...prev, [field]: newValue }
        })

        if (newValue.length > 0) {
            setCanProceed(true)
        } else {
            setCanProceed(false)
        }
    }, [setCanProceed])

    const handlePasswordRecover = useCallback(async () => {
        try {
            const response = await post<ResponseInterface>('/me/change_password', form)
            if (response.status >= 300) {
                Alert.alert('Erro', response.data.message)
                return
            }
            goBack()
        } catch (err: any) {
            Alert.alert('Erro', err.response?.data?.message || JSON.stringify(err))
        }
    }, [form])

    return (
        <View style={mainStyles.container_alt}>
            <PasswordSection
                password_value={form.password}
                confirmation_value={form.password_confirmation}
                handle_password={(text) => handleForm(text, 'password')}
                handle_confirmation={(text) => handleForm(text, 'password_confirmation')}
                canProceed={setCanProceed}
            />

            <CustomPressable
                disabled={!canProceed}
                text='Confirmar'
                onPress={() => handlePasswordRecover()}
            />
        </View>
    )
}
