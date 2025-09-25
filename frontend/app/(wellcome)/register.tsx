import { CustomPressable } from '@/components/custom-pressable';
import { BirthdaySection } from '@/components/register-form/birthday-section';
import { ConfirmationSection } from '@/components/register-form/confimation-section';
import { EmailSection } from '@/components/register-form/email-section';
import { NameSection } from '@/components/register-form/name-section';
import { NicknameSection } from '@/components/register-form/nickname-section';
import { PasswordSection } from '@/components/register-form/password-section';
import { mainStyles } from '@/constants/theme';
import { UserRegister } from '@/interfaces/UserInterface';
import api from '@/services/api';
import { router } from 'expo-router';
import { useState, useCallback, useMemo } from 'react';
import { Alert, View } from 'react-native';

export default function RegisterScreen() {
    const steps = [
        'email',
        'password',
        'birthday',
        'name',
        'nickname',
        'code',
    ];

    const [form, setForm] = useState<UserRegister>({
        email: 'test@email.com',
        password: 'Senha123@',
        password_confirmation: 'Senha123@',
        name: 'User Test',
        nickname: 'user_test',
        birthday: '2000-01-01',
        code: '',
    });

    const [step, setStep] = useState<typeof steps[number]>('email');

    const handleForm = useCallback((newValue: string, field: keyof UserRegister) => {
        setForm((prev) => {
            return { ...prev, [field]: newValue };
        });
    }, []);

    const submitStep = useCallback(async () => {
        setStep(prev => {
            const currentIndex = steps.findIndex(item => item === prev);
            const nextStep = steps[currentIndex + 1]
            if (!nextStep) return prev
            return nextStep
        })
    }, []);

    const handleRegister = useCallback(async () => {
        try {
            const response = await api.post('/auth/register', form);
            submitStep();
            Alert.alert(
                'Código enviado',
                response.data.message
            );
        } catch (err: any) {
            Alert.alert('Erro', err.response?.data?.message || JSON.stringify(err));
        }
    }, [form]);

    const handleVerifyCode = useCallback(async () => {
        try {
            console.log('form', form)
            const response = await api.post('/auth/verify_email', {
                email: form.email,
                code: form.code
            });
            Alert.alert('Sucesso', response.data.message);
            router.back();
        } catch (err: any) {
            Alert.alert('Erro', err.response?.data?.message || JSON.stringify(err));
        }
    }, [form])


    const renderButton = useMemo((): { text: string, action: () => Promise<void> } => {
        switch (step) {
            case 'nickname': return {
                text: 'Finalizar',
                action: handleRegister
            };
            case 'code': return {
                text: 'Confirmar',
                action: handleVerifyCode
            };
            default: return {
                text: 'Avançar',
                action: submitStep
            };
        }
    }, [step, handleForm, handleVerifyCode])

    return (
        <View style={mainStyles.container_alt}>
            {step === 'email' && (
                <EmailSection value={form.email} handle={(text) => handleForm(text, 'email')} />
            )}

            {step === 'password' && (
                <PasswordSection
                    password_value={form.password}
                    confirmation_value={form.password_confirmation}
                    handle_password={(text) => handleForm(text, 'password')}
                    handle_confirmation={(text) => handleForm(text, 'password_confirmation')}
                />
            )}

            {step === 'birthday' && (
                <BirthdaySection value={form.birthday} handle={(text) => handleForm(text, 'birthday')} />
            )}

            {step === 'name' && (
                <NameSection value={form.name} handle={(text) => handleForm(text, 'name')} />
            )}

            {step === 'nickname' && (
                <NicknameSection value={form.nickname} handle={(text) => handleForm(text, 'nickname')} />
            )}

            {step === 'code' && (
                <ConfirmationSection
                    value={form.code}
                    handle={(text) => handleForm(text, 'code')}
                />
            )}

            <CustomPressable
                text={renderButton.text}
                onPress={renderButton.action}
            />
        </View>
    );
}
