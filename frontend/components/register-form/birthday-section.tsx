import { useState, useEffect, Dispatch, SetStateAction, useMemo, useRef } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { InfoSection } from '../info-section'
import { Colors } from '@/constants/theme'
import { Dropdown } from 'react-native-element-dropdown'

interface BirthdaySectionProps {
  value: string | undefined
  handle: (newValue: string) => void
  canProceed: Dispatch<SetStateAction<boolean>>
  error?: string
}

export function BirthdaySection(props: BirthdaySectionProps) {
  const [day, setDay] = useState<string>('')
  const [month, setMonth] = useState<string>('')
  const [year, setYear] = useState<string>('')
  const [error, setError] = useState<string | undefined>(undefined)

  const isProceedRef = useRef<boolean>(false)

  useEffect(() => {
    if (props.value) {
      const [y, m, d] = props.value.split('-')
      setYear(y || '')
      setMonth(m || '')
      setDay(d || '')
    }
  }, [props.value])

  useEffect(() => {
    setError(props.error)
  }, [props.error])

  useEffect(() => {
    if (!year || !month || !day) {
      if (isProceedRef.current) {
        isProceedRef.current = false
        props.canProceed(false)
      }
      return
    }

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
      if (isProceedRef.current) {
        isProceedRef.current = false
        props.canProceed(false)
      }
      return
    }

    setError('')
    const formatted = `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    props.handle(formatted)

    if (!isProceedRef.current) {
      isProceedRef.current = true
      props.canProceed(true)
    }
  }, [year, month, day])

  const days = useMemo(
    () =>
      Array.from({ length: 31 }, (_, i) => ({
        label: String(i + 1).padStart(2, '0'),
        value: String(i + 1).padStart(2, '0'),
      })),
    []
  )

  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        label: String(i + 1).padStart(2, '0'),
        value: String(i + 1).padStart(2, '0'),
      })),
    []
  )

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear()
    return Array.from({ length: 120 }, (_, i) => {
      const val = String(currentYear - i)
      return { label: val, value: val }
    })
  }, [])

  return (
    <View style={styles.container}>
      <InfoSection
        head="Qual é a sua data de nascimento?"
        body={`Insira sua data de aniversário.\nVocê deve ter mais de 12 anos para se inscrever.`}
      />

      <View style={styles.dropdownContainer}>
        <Dropdown
          style={[styles.dropdown, error ? styles.dropdownError : null]}
          containerStyle={styles.dropdownContainerStyle}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          itemTextStyle={styles.itemTextStyle}
          activeColor={Colors.gray3}
          data={days}
          labelField="label"
          valueField="value"
          placeholder="Dia"
          value={day || null}
          onChange={(item) => setDay(item.value)}
          autoScroll={false} // <--- desativa auto-scroll para evitar "snap"
          flatListProps={{
            initialNumToRender: 20,
            keyExtractor: (item) => item.value,
          }}
        />

        <Dropdown
          style={[styles.dropdown, error ? styles.dropdownError : null]}
          containerStyle={styles.dropdownContainerStyle}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          itemTextStyle={styles.itemTextStyle}
          activeColor={Colors.gray3}
          data={months}
          labelField="label"
          valueField="value"
          placeholder="Mês"
          value={month || null}
          onChange={(item) => setMonth(item.value)}
          autoScroll={false}
          flatListProps={{
            initialNumToRender: 12,
            keyExtractor: (item) => item.value,
          }}
        />

        <Dropdown
          style={[styles.dropdown, error ? styles.dropdownError : null]}
          containerStyle={styles.dropdownContainerStyle}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          itemTextStyle={styles.itemTextStyle}
          activeColor={Colors.gray3}
          data={years}
          labelField="label"
          valueField="value"
          placeholder="Ano"
          value={year || null}
          onChange={(item) => setYear(item.value)}
          autoScroll={false}
          flatListProps={{
            initialNumToRender: 30,
            keyExtractor: (item) => item.value,
          }}
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
