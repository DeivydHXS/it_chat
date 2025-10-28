import { Colors } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface GroupsItemProps {
    title: string
    description: string
    icon_image_url?: string
    cover_image_url?: string
    members?: number
    onPress?: () => void
}

export function GroupsItem(props: GroupsItemProps) {
    return (
        <Pressable onPress={props.onPress}>
            <View style={{
                width: '100%',
                borderRadius: 24,
                backgroundColor: Colors.gray1,
                overflow: 'hidden',
                minHeight: 200,
                marginBottom: 16
            }}>
                <View style={{
                    height: 100
                }}>
                    {props.cover_image_url ? (
                        <Image
                            source={{ uri: props.cover_image_url }}
                            style={{ width: '100%', height: '100%' }}
                        />
                    ) : (
                        ''
                    )}
                </View>

                <View style={{
                    backgroundColor: Colors.light,
                    minHeight: 100,
                    padding: 16,
                    paddingTop: 40,
                    gap: 16
                }}>
                    <View style={styles.profile_image}>
                        {props.icon_image_url ? (
                            <Image
                                source={{ uri: props.icon_image_url }}
                                style={{ width: 64, height: 64 }}
                            />
                        ) : (
                            <MaterialIcons name="person" size={76} color={'#B4DBFF'} style={{ right: 6 }} />
                        )}
                    </View>

                    <View>
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: 18
                        }}>{props.title}</Text>
                        <Text style={{
                            color: Colors.gray3
                        }}>{props.description}</Text>
                    </View>

                    {props.members &&
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 4
                        }}>
                            <View style={styles.dot} />
                            <Text style={{
                                color: Colors.gray3
                            }}>{props.members} membros</Text>
                        </View>
                    }
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    dot: {
        width: 9,
        height: 9,
        borderRadius: 5,
        backgroundColor: Colors.gray4,
    },
    profile_image: {
        width: 64,
        height: 64,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EAF2FF',
        borderRadius: 50,
        overflow: 'hidden',
        position: 'absolute',
        top: -32,
        left: 16
    },
})