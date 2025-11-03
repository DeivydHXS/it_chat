import { View, TextInput, StyleSheet, Text, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/theme'

interface SearchBarProps {
  value: string
  onChange: (text: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <View style={{
      width: '100%',
      gap: 16
    }}>
      <View style={styles.container}>
        <Ionicons name="search" size={16} color={Colors.dark} />
        <TextInput
        maxLength={42}
          autoCapitalize='none'
          placeholder={placeholder || 'Digite sua pesquisa'}
          value={value}
          onChangeText={onChange}
          style={styles.input}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.light2,
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 24,
    height: 50,
    gap: 8
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.textOnInput,
  }
})
