import { CustomPressable } from "@/components/custom-pressable";
import { BirthdaySection } from "@/components/register-form/birthday-section";
import { ConfirmationSection } from "@/components/register-form/confimation-section";
import { EmailSection } from "@/components/register-form/email-section";
import { NameSection } from "@/components/register-form/name-section";
import { NicknameSection } from "@/components/register-form/nickname-section";
import { PasswordSection } from "@/components/register-form/password-section";
import { mainStyles } from "@/constants/theme";
import { useCallback, useState } from "react";
import { Alert, View } from "react-native";

interface FormRegister {
    email?: string,
    password?: string,
    password_confirmation?: string
    name?: string,
    nickname?: string
    birthday?: string
}

export default function RegisterScreen() {
    const [form, setForm] = useState<FormRegister>({})
    const [step, setStep] = useState<'email' | 'password' | 'name' | 'nickname' | 'birthday' | 'confirmation'>('email')

    const submitStep = useCallback(() => {
        switch (step) {
            case 'email': {
                setStep('password');
                return
            }
            case 'password': {
                setStep('birthday');
                return
            }
            case 'birthday': {
                setStep('name');
                return
            }
            case 'name': {
                setStep('nickname');
                return
            }
            case 'nickname': {
                setStep('confirmation');
                return
            }
            case 'confirmation': {
                Alert.alert('Formulario', JSON.stringify(form))
                return
            }
        }
    }, [step])

    const handleForm = useCallback((newValue: string, field: string) => {
        setForm(prev => {
            return {
                ...prev,
                [field]: newValue
            }
        })
    }, [])

    return (
        <View style={mainStyles.container_alt}>
            {step === 'email' &&
                <EmailSection
                    value={form.email}
                    handle={(text, field) => handleForm(text, field)}
                />
            }
            {step === 'password' &&
                <PasswordSection
                    password_value={form.password}
                    confirmation_value={form.password_confirmation}
                    handle_password={(text) => handleForm(text, 'password')}
                    handle_confirmation={(text) => handleForm(text, 'password_confirmation')}
                />
            }
            {step === 'birthday' &&
                <BirthdaySection
                    value={form.birthday}
                    handle={(text) => handleForm(text, 'birthday')}
                />
            }
            {step === 'name' &&
                <NameSection
                    value={form.name}
                    handle={(text, field) => handleForm(text, field)}
                />
            }
            {step === 'nickname' &&
                <NicknameSection
                    value={form.nickname}
                    handle={(text, field) => handleForm(text, field)}
                />
            }
            {step === 'confirmation' &&
                <ConfirmationSection
                    value={form.nickname}
                    handle={(text, field) => handleForm(text, field)}
                />
            }


            <CustomPressable text={step === 'confirmation' ? 'Confirmar' : 'Avançar'} onPress={submitStep} />
        </View>
    )
}