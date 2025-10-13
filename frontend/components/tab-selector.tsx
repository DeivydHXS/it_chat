import { Colors } from '@/constants/theme'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'

interface TabSelectorProps {
  active: 'friends' | 'requests'
  onChange: (tab: 'friends' | 'requests') => void
  requestsCount?: number
}

export function TabSelector({ active, onChange, requestsCount }: TabSelectorProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, active === 'friends' && styles.activeTab]}
        onPress={() => onChange('friends')}
      >
        <Text style={[styles.text, active === 'friends' && styles.activeText]}>Amigos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, active === 'requests' && styles.activeTab]}
        onPress={() => onChange('requests')}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.text, active === 'requests' && styles.activeText]}>
            Solicitações
          </Text>
          {requestsCount ?
            <View style={styles.badge}>
              <Text>{requestsCount}</Text>
            </View> : ''}
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.light2,
    borderRadius: 24,
    overflow: 'hidden'
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8
  },
  activeTab: {
    backgroundColor: Colors.dark,
  },
  text: {
    color: Colors.dark,
    fontWeight: '600',
  },
  activeText: {
    color: Colors.light,
  },
  badge: {
    backgroundColor: Colors.red,
    color: Colors.light,
    fontWeight: 'condensedBold',
    borderRadius: 100,
    padding: 2
  },
})
