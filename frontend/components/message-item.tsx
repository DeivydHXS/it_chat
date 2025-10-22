import { View, Text, StyleSheet, Pressable, Modal, TouchableOpacity, Animated } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/theme'
import { UserInterface } from '@/interfaces/user-interfaces'
import { MessageInterface } from '@/interfaces/chat-interfaces'
import { useEffect, useRef, useState } from 'react'
import * as Clipboard from 'expo-clipboard'

interface MessageItemProps {
  isMine: boolean
  user?: UserInterface
  friend?: UserInterface
  mes: MessageInterface
  onDeleteMessage?: (mes: MessageInterface) => void
}

export function MessageItem({ isMine, user, friend, mes, onDeleteMessage }: MessageItemProps) {
  const [modalVisible, setModalVisible] = useState(false)
  const slideAnim = useRef(new Animated.Value(0)).current

  const openModal = () => {
    setModalVisible(true)
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setModalVisible(false))
  }

  const handleCopy = async () => {
    await Clipboard.setStringAsync(mes.content)
    closeModal()
  }

  const handleDelete = () => {
    if (onDeleteMessage) onDeleteMessage(mes)
    closeModal()
  }

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0], // sobe de baixo
  })

  return (
    <View
      style={{
        marginVertical: 4,
        maxWidth: '80%',
        alignSelf: isMine ? 'flex-end' : 'flex-start',
      }}
    >
      <Pressable
        onLongPress={openModal}
        style={{
          backgroundColor: isMine ? Colors.red : Colors.gray5,
          borderRadius: 20,
          paddingVertical: 8,
          paddingHorizontal: 12,
        }}
      >
        <Text style={{ color: isMine ? Colors.light : Colors.dark, fontWeight: 'bold' }}>
          {isMine ? user?.name : friend?.name}
        </Text>
        <Text style={{ color: isMine ? Colors.light : Colors.dark }}>{mes.content}</Text>
      </Pressable>

      <Modal
        transparent
        visible={modalVisible}
        animationType="none"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.overlay} onPress={closeModal}>
          <Animated.View
            style={[
              styles.bottomSheet,
              { transform: [{ translateY }] },
            ]}
          >
            <View style={styles.handle} />

            <TouchableOpacity style={styles.option} onPress={handleCopy}>
              <MaterialIcons name="content-copy" size={22} color={Colors.dark} />
              <Text style={styles.optionText}>Copiar mensagem</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={handleDelete}>
              <MaterialIcons name="delete" size={22} color={Colors.red} />
              <Text style={[styles.optionText, { color: Colors.red }]}>Excluir mensagem</Text>
            </TouchableOpacity>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: Colors.light2,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 8,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray4,
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    color: Colors.dark,
  },
})
