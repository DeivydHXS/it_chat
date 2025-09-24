import { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { InfoSection } from '../info-section'
import { Colors } from '@/constants/theme'

interface BirthdaySectionProps {
  value: string | undefined
  handle: (newValue: string) => void
}

export function BirthdaySection(props: BirthdaySectionProps) {
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')

  useEffect(() => {
    if (props.value) {
      const [y, m, d] = props.value.split('-')
      setYear(y || '')
      setMonth(m || '')
      setDay(d || '')
    }
  }, [props.value])

  useEffect(() => {
    if (year && month && day) {
      const formatted = `${year.padStart(4, '0')}-${month.padStart(2,'0')}-${day.padStart(2, '0')}`
      props.handle(formatted)
    }
  }, [year, month, day])

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
  const years = Array.from({ length: 120 }, (_, i) => String(new Date().getFullYear() - i))

  return (
    <View style={styles.container}>
      <InfoSection
        head='Qual é a sua data de nascimento?'
        body='Insira sua data de aniversário.
Você deve ter mais de 12 anos para se inscrever.'
      />

      <View style={styles.pickerContainer}>
        <View style={styles.pickerItem}>
          <Picker selectedValue={day} onValueChange={(value) => setDay(value)}>
            <Picker.Item label='Dia' value='' />
            {days.map((d) => (
              <Picker.Item key={d} label={d} value={d} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerItem}>
          <Picker selectedValue={month} onValueChange={(value) => setMonth(value)}>
            <Picker.Item label='Mês' value='' />
            {months.map((m) => (
              <Picker.Item key={m} label={m} value={m} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerItem}>
          <Picker selectedValue={year} onValueChange={(value) => setYear(value)}>
            <Picker.Item label='Ano' value='' />
            {years.map((y) => (
              <Picker.Item key={y} label={y} value={y} />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  pickerItem: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.gray2,
    borderRadius: 8,
    overflow: 'hidden',
  },
})
