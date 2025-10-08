import { View, TextInput, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/theme'

interface SearchBarProps {
  value: string
  onChange: (text: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color={Colors.dark} style={{ marginRight: 16 }} />
      <TextInput
        placeholder={placeholder || 'Digite sua pesquisa'}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChange}
        style={styles.input}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.light,
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 24,
    height: 50,
    borderColor: Colors.gray3
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.gray3,
  },
})
