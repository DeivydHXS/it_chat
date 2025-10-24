import { StyleSheet, Text, View } from "react-native";

import { InfoSection } from "../info-section";
import { CustomInputText } from "../custom-input-text";
import { useEffect, useState } from "react";
import { CustomInputNumber } from "../custom-input-number";


interface BaseSectionProps {
    step: 'email' | 'name' | 'nickname' | 'code'
    value: string | undefined
    handle: (newValue: string, field: string) => void
    error?: string
    onFocus?: () => void
}

export function BaseSection(props: BaseSectionProps) {
    const placeholders = {
        'email': {
            head: "Qual é o seu endereço de e-mail?",
            body: "Insira um endereço de email válido. Ninguém verá essa informação no seu perfil.",
            button_text: 'Digite seu email',
            max_length: 50
        },
        'name': {
            head: "Qual é o seu nome?",
            body: "Insira um nome para seus amigos te encontrarem.",
            button_text: 'Digite seu nome',
            max_length: 25
        },
        'nickname': {
            head: "Escolha um nome de usuário",
            body: "Escolha um apelido único para sua conta.",
            button_text: 'Digite seu apelido',
            max_length: 10
        },
        'code': {
            head: "Insira o código",
            body: "Insira o código de validação que foi enviado em seu e-mail.",
            button_text: 'Digite seu código',
            max_length: 6
        }
    }

    return (
        <View style={styles.container}>
            <InfoSection
                head={placeholders[props.step].head}
                body={placeholders[props.step].body}
            />

            {props.step === 'code' ?
                <CustomInputNumber
                    error={props.error}
                    placeholder={placeholders[props.step].button_text}
                    value={props.value || ''}
                    onChangeText={(text) => {
                        props.handle(text, props.step)
                    }}
                    maxLength={placeholders[props.step].max_length}
                />
                :
                <CustomInputText
                    error={props.error}
                    placeholder={placeholders[props.step].button_text}
                    value={props.value || ''}
                    onChangeText={(text) => {
                        props.handle(text, props.step)
                    }}
                    maxLength={placeholders[props.step].max_length}
                    showCounter={true}
                />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 16
    }
})