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

export default function ForgotPasswordScreen() {
    const { post } = useApi()
    const [emailError, setEmailError] = useState<string>('')
    const [codeError, setCodeError] = useState<string>('')
    const [canProceed, setCanProceed] = useState<boolean>(false)

    const steps = [
        'email',
        'code',
        'password',
    ]

    const [form, setForm] = useState<{
        email: string,
        code: string,
        password: string,
        password_confirmation: string
    }>({
        email: '',
        code: '',
        password: '',
        password_confirmation: '',
    })

    const [step, setStep] = useState<typeof steps[number]>('email')

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

    const submitStep = useCallback(async () => {
        setStep(prev => {
            const currentIndex = steps.findIndex(item => item === prev)
            const nextStep = steps[currentIndex + 1]
            if (!nextStep) return prev
            return nextStep
        })
        setCanProceed(false)
    }, [setCanProceed])

    const handleIsEmailValid = useCallback(async () => {
        const response = await post<IsEmailValidResponse>('/auth/forgot_password', { email: form.email })
        if (response.status >= 300) {
            setEmailError(response.data.errors?.email || '')
            return
        }
        submitStep()
    }, [form])

    const handleVerifyCode = useCallback(async () => {
        try {
            const response = await post<ForgotPasswordResponseInterface>('/auth/code_verification', {
                email: form.email,
                code: form.code
            })
            if (response.status >= 300) {
                setCodeError(response.data.errors?.code || '')
                return
            }
            submitStep()
        } catch (err: any) {
            Alert.alert('Erro', err.response?.data?.error || JSON.stringify(err))
        }
    }, [form])

    const handlePasswordRecover = useCallback(async () => {
        try {
            const response = await post<ResponseInterface>('/auth/change_password', form)
            if (response.status >= 300) {
                Alert.alert('Erro', response.data.message)
                return
            }
            goBack()
        } catch (err: any) {
            Alert.alert('Erro', err.response?.data?.message || JSON.stringify(err))
        }
    }, [form])

    const renderButton = useMemo((): { text: string, action: () => Promise<void> } => {
        switch (step) {
            case 'email': return {
                text: 'Avançar',
                action: handleIsEmailValid
            }
            case 'code': return {
                text: 'Confirmar',
                action: handleVerifyCode
            }
            case 'password': return {
                text: 'Confirmar',
                action: handlePasswordRecover
            }
            default: return {
                text: 'Avançar',
                action: submitStep
            }
        }
    }, [step, handleForm, handleVerifyCode])

    return (
        <View style={mainStyles.container_alt}>
            {step === 'email' && (
                <BaseSection step='email' error={emailError}
                    value={form.email} handle={(text) => handleForm(text, 'email')} />
            )}

            {step === 'code' && (
                <BaseSection step='code'
                    error={codeError}
                    value={form.code}
                    handle={(text) => handleForm(text, 'code')}
                    
                />
            )}

            {step === 'password' && (
                <PasswordSection
                    password_value={form.password}
                    confirmation_value={form.password_confirmation}
                    handle_password={(text) => handleForm(text, 'password')}
                    handle_confirmation={(text) => handleForm(text, 'password_confirmation')}
                    canProceed={setCanProceed}
                />
            )}

            <CustomPressable
                disabled={!canProceed}
                text={renderButton.text}
                onPress={renderButton.action}
            />
        </View>
    )
}
