import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { InfoSection } from '../info-section'
import { Colors } from '@/constants/theme'
import { Dropdown } from 'react-native-element-dropdown'

interface BirthdaySectionProps {
  value: string | undefined
  handle: (newValue: string) => void
  canProceed: Dispatch<SetStateAction<boolean>>
}

export function BirthdaySection(props: BirthdaySectionProps) {
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (props.value) {
      const [y, m, d] = props.value.split('-')
      setYear(y || '')
      setMonth(m || '')
      setDay(d || '')
    }
  }, [props.value])

  useEffect(() => {
    props.canProceed(false)
    if (year && month && day) {
      const formatted = `${year.padStart(4, '0')}-${month.padStart(
        2,
        '0'
      )}-${day.padStart(2, '0')}`

      const birthDate = new Date(Number(year), Number(month) - 1, Number(day))
      const today = new Date()

      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      const dayDiff = today.getDate() - birthDate.getDate()

      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--
      }

      if (age < 12) {
        setError('Você deve ter pelo menos 12 anos para se inscrever.')
        return
      }

      setError('')
      props.handle(formatted)
      props.canProceed(true)
    }
  }, [year, month, day])

  const days = Array.from({ length: 31 }, (_, i) => ({
    label: String(i + 1).padStart(2, '0'),
    value: String(i + 1).padStart(2, '0'),
  }))
  const months = Array.from({ length: 12 }, (_, i) => ({
    label: String(i + 1).padStart(2, '0'),
    value: String(i + 1).padStart(2, '0'),
  }))
  const years = Array.from({ length: 120 }, (_, i) => {
    const val = String(new Date().getFullYear() - i)
    return { label: val, value: val }
  })

  return (
    <View style={styles.container}>
      <InfoSection
        head="Qual é a sua data de nascimento?"
        body={`Insira sua data de aniversário.\nVocê deve ter mais de 12 anos para se inscrever.`}
      />

      <View style={styles.dropdownContainer}>
        <Dropdown
          style={[
            styles.dropdown,
            error ? styles.dropdownError : null,
          ]}
          containerStyle={styles.dropdownContainerStyle}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          itemTextStyle={styles.itemTextStyle}
          activeColor={Colors.gray3}
          data={days}
          labelField="label"
          valueField="value"
          placeholder="Dia"
          value={day}
          onChange={(item) => setDay(item.value)}
        />

        <Dropdown
          style={[
            styles.dropdown,
            error ? styles.dropdownError : null,
          ]}
          containerStyle={styles.dropdownContainerStyle}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          itemTextStyle={styles.itemTextStyle}
          activeColor={Colors.gray3}
          data={months}
          labelField="label"
          valueField="value"
          placeholder="Mês"
          value={month}
          onChange={(item) => setMonth(item.value)}
        />

        <Dropdown
          style={[
            styles.dropdown,
            error ? styles.dropdownError : null,
          ]}
          containerStyle={styles.dropdownContainerStyle}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          itemTextStyle={styles.itemTextStyle}
          activeColor={Colors.gray3}
          data={years}
          labelField="label"
          valueField="value"
          placeholder="Ano"
          value={year}
          onChange={(item) => setYear(item.value)}
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 16,
  },
  dropdownContainer: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  dropdown: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.gray2,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: Colors.light,
    justifyContent: 'center',
    height: 50,
  },
  dropdownError: {
    borderColor: 'red',
  },
  dropdownContainerStyle: {
    backgroundColor: Colors.light,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray2,
  },
  placeholderStyle: {
    color: Colors.gray2,
    fontSize: 14,
  },
  selectedTextStyle: {
    color: Colors.dark,
    fontSize: 14,
    fontWeight: '500',
  },
  itemTextStyle: {
    color: Colors.dark,
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginTop: 4,
    marginLeft: 4,
  },
})
