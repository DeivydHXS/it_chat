import { CustomPressable } from '@/components/custom-pressable'
import { BaseSection } from '@/components/register-form/base-section'
import { BirthdaySection } from '@/components/register-form/birthday-section'
import { PasswordSection } from '@/components/register-form/password-section'
import { mainStyles } from '@/constants/theme'
import { useApi } from '@/hooks/use-api'
import { ResponseInterface } from '@/interfaces/common-interfaces'
import { UserRegister } from '@/interfaces/user-interfaces'
import { router } from 'expo-router'
import { useState, useCallback, useMemo } from 'react'
import { Alert, View } from 'react-native'

export default function RegisterScreen() {
    const { post } = useApi()
    const [emailError, setEmailError] = useState<string>('')
    const [canProceed, setCanProceed] = useState<boolean>(false)

    const steps = [
        'email',
        'password',
        'birthday',
        'name',
        'nickname',
        'code',
    ]

    const [form, setForm] = useState<UserRegister>({
        email: '',
        password: '',
        password_confirmation: '',
        name: '',
        nickname: '',
        nickname_hash: '',
        birthday: '',
        code: ''
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

    const handleRegister = useCallback(async () => {
        try {
            const response = await post<ResponseInterface>('/auth/register', form)
            submitStep()
            Alert.alert(
                'Código enviado',
                response?.data?.message
            )
        } catch (err: any) {
            Alert.alert('Erro', err.response?.data?.message || JSON.stringify(err))
        }
    }, [form])

    const handleIsEmailValid = useCallback(async () => {
        const response = await post<ResponseInterface>('/auth/is_email_not_used', { email: form.email })
        if (response.status >= 300) {
            setEmailError(response.data.errors?.email || '')
            return
        }
        submitStep()
    }, [form])

    const handleVerifyCode = useCallback(async () => {
        try {
            const response = await post<ResponseInterface>('/auth/verify_email', {
                email: form.email,
                code: form.code
            })
            Alert.alert('Sucesso', response?.data?.message)
            router.back()
        } catch (err: any) {
            Alert.alert('Erro', err.response?.data?.error || JSON.stringify(err))
        }
    }, [form])

    const renderButton = useMemo((): { text: string, action: () => Promise<void> } => {
        switch (step) {
            case 'nickname': return {
                text: 'Finalizar',
                action: handleRegister
            }
            case 'email': return {
                text: 'Avançar',
                action: handleIsEmailValid
            }
            case 'code': return {
                text: 'Confirmar',
                action: handleVerifyCode
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

            {step === 'password' && (
                <PasswordSection
                    password_value={form.password}
                    confirmation_value={form.password_confirmation}
                    handle_password={(text) => handleForm(text, 'password')}
                    handle_confirmation={(text) => handleForm(text, 'password_confirmation')}
                    canProceed={setCanProceed}
                />
            )}

            {step === 'birthday' && (
                <BirthdaySection
                    value={form.birthday}
                    handle={(text) => handleForm(text, 'birthday')}
                    canProceed={setCanProceed}
                />
            )}

            {step === 'name' && (
                <BaseSection
                    step='name'
                    value={form.name}
                    handle={(text) => handleForm(text, 'name')}
                />
            )}

            {step === 'nickname' && (
                <BaseSection
                    step='nickname'
                    value={form.nickname}
                    handle={(text) => handleForm(text, 'nickname')}
                />
            )}

            {step === 'code' && (
                <BaseSection step='code'
                    value={form.code}
                    handle={(text) => handleForm(text, 'code')}
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
