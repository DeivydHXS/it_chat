import { StyleSheet, Text, View } from "react-native";

import { InfoSection } from "../info-section";
import { CustomInputText } from "../custom-input-text";
import { useEffect, useState } from "react";
import { CustomInputNumber } from "../custom-input-number";
import { CustomInputLargeText } from "../custom-input-large-text";


interface BaseSectionProps {
    value: string | undefined
    handle: (newValue: string) => void
    error?: string
    onFocus?: () => void
    head?: string
    body?: string
    button_text?: string
    max_length?: number
    showCounter?: boolean
    isTextArea?: boolean
}

export function BaseSection(props: BaseSectionProps) {
    return (
        <View style={styles.container}>
            <InfoSection
                head={props.head || ''}
                body={props.body || ''}
            />
            {props.isTextArea ?
                <CustomInputLargeText
                    error={props.error}
                    placeholder={props.button_text}
                    value={props.value || ''}
                    onChangeText={(text) => {
                        props.handle(text)
                    }}
                    maxLength={props.max_length}
                    showCounter={props.showCounter}
                />
                :
                <CustomInputText
                    error={props.error}
                    placeholder={props.button_text}
                    value={props.value || ''}
                    onChangeText={(text) => {
                        props.handle(text)
                    }}
                    maxLength={props.max_length}
                    showCounter={props.showCounter}
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