import { CustomInputText, styles } from "@/components/custom-input-text";
import { mainStyles } from "@/constants/theme";
import { useCallback, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

interface FormRegister {
    email?:string,
    password?:string,
    comfirm_password?:string
    name?:string,
    nickname?:string
    birthday?:string
}

export default function RegisterScreen() {
    
    const [form,setForm] = useState<FormRegister>({})
    const [step, setStep] = useState<'email' | 'password' | 'name'>('email')

    const submitStep = useCallback(() => {
        switch (step) {
            case 'email': {
                setStep('password');
                return
            }
            case 'password': {
                setStep('name');
                return
            }
            case 'name': {
                Alert.alert(`Form`,`${form.email}  / ${form.password}`)
                return
            }
        }
    }, [step])

    const handleForm = useCallback((newValue:string,field:keyof FormRegister) => {
            setForm(prev => {
                return {
                    ...prev,
                    [field]:newValue
                }
            })
    },[])

    return (
        <View style={mainStyles.container}>
            {step === 'email' &&
                <View>
                    <TextInput style={styles.input} value={form.email} onChangeText={(text:string) => handleForm(text,'email')} />
                </View>
            }
            {step === 'password' &&
                <View>
                    <TextInput style={styles.input} value={form.password} onChangeText={(text:string) => handleForm(text,'password')} />
                </View>
            }
            {step === 'name' &&
                <View>
                    <Text style={{
                        color: 'red'
                    }}>
                        Name
                    </Text>
                </View>
            }
            <Pressable onPress={submitStep}>
                <Text>Continuar</Text>
            </Pressable>

        </View>
    )
}