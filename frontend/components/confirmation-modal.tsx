import { Colors } from "@/constants/theme"
import { Text, View } from "react-native"
import { CustomPressable } from "./custom-pressable"

interface ConfirmationModalProps {
    title: string
    message: string
    onAccept: () => void
    onCancel: () => void
}

export function ConfirmationModal(props: ConfirmationModalProps) {
    return (
        <View style={{
            zIndex: 1000,
            position: 'absolute',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <View style={{
                width: '70%',
                gap: 8,
                backgroundColor: Colors.light,
                borderRadius: 24,
                alignItems: 'center',
                paddingVertical: 24,
                paddingHorizontal: 20,
                borderWidth: 1,
                borderColor: Colors.gray4
            }}>
                <View style={{
                    marginBottom: 8,
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 18
                    }}>{props.title}</Text>
                    <Text>{props.message}</Text>
                </View>
                <CustomPressable text='Confirmar' onPress={props.onAccept}>
                </CustomPressable>
                <CustomPressable isAlt={true} text='Cancelar' onPress={props.onCancel}>
                </CustomPressable>
            </View>
        </View>
    )
}