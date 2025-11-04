import { Colors } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import { Stack } from 'expo-router'
import { goBack } from 'expo-router/build/global-state/routing'

export default function GroupsLayout() {

    return (
        <Stack initialRouteName='index'>
            <Stack.Screen name='index' options={{
                title: 'Grupos',
                headerTitleStyle: { fontWeight: 'condensedBold' },
                headerTitleAlign: 'center',
                headerShown: true,
                headerStyle: { backgroundColor: Colors.red },
                headerTintColor: Colors.light,
            }} />
            <Stack.Screen name='create' options={{
                title: 'Criar grupo',
                headerTitleStyle: { fontWeight: 'condensedBold' },
                headerTitleAlign: 'center',
                headerShown: true,
                headerStyle: { backgroundColor: Colors.red },
                headerTintColor: Colors.light,
                headerLeft: (props: any) => (
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color={Colors.light}
                        onPress={() => goBack()}
                    />
                ),
            }} />
            <Stack.Screen name="[groupId]" options={{
                title: 'GroupID',
                headerTitleStyle: { fontWeight: 'condensedBold' },
                headerTitleAlign: 'center',
                headerShown: true,
                headerStyle: { backgroundColor: Colors.red },
                headerTintColor: Colors.light,
                headerLeft: (props: any) => (
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color={Colors.light}
                        onPress={() => goBack()}
                    />
                ),
            }} />
            <Stack.Screen name="options" options={{
                title: 'Informações do grupo',
                headerTitleStyle: { fontWeight: 'condensedBold' },
                headerTitleAlign: 'center',
                headerShown: true,
                headerStyle: { backgroundColor: Colors.red },
                headerTintColor: Colors.light,
                headerLeft: (props: any) => (
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color={Colors.light}
                        onPress={() => goBack()}
                    />
                ),
            }} />
            <Stack.Screen name="add-member" options={{
                title: 'Adicionar membro',
                headerTitleStyle: { fontWeight: 'condensedBold' },
                headerTitleAlign: 'center',
                headerShown: true,
                headerStyle: { backgroundColor: Colors.red },
                headerTintColor: Colors.light,
                headerLeft: (props: any) => (
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color={Colors.light}
                        onPress={() => goBack()}
                    />
                ),
            }} />
            <Stack.Screen name="edit" options={{
                title: 'Editar informações do grupo',
                headerTitleStyle: { fontWeight: 'condensedBold' },
                headerTitleAlign: 'center',
                headerShown: true,
                headerStyle: { backgroundColor: Colors.red },
                headerTintColor: Colors.light,
                headerLeft: (props: any) => (
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color={Colors.light}
                        onPress={() => goBack()}
                    />
                ),
            }} />
        </Stack>
    )
}