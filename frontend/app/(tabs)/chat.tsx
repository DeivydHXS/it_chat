import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native'
import { useChatSocket } from '@/hooks/use-chat-socket'
import axios from 'axios'

interface Message {
  id: string
  chat_id: string
  user_id: string
  type: string
  content: string
  created_at: string
}

export default function ChatScreen({ route }: any) {
  const { chatId, userId } = route.params
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')

  useChatSocket(chatId, (msg: any) => {
    setMessages((prev) => [...prev, msg])
  })

  useEffect(() => {
    axios
      .get(`${process.env.EXPO_PUBLIC_API_URL}/messages/${chatId}`)
      .then((res) => setMessages(res.data.data.messages))
  }, [chatId])

  const sendMessage = async () => {
    if (!text.trim()) return

    await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/messages`, {
      chat_id: chatId,
      user_id: userId,
      type: 'text',
      content: text,
    })

    setText('')
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.message}>
            <Text>{item.content}</Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite uma mensagem..."
          value={text}
          onChangeText={setText}
        />
        <Button title="Enviar" onPress={sendMessage} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  message: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
})
