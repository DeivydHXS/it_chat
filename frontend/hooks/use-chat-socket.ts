import { useEffect } from 'react'
import SocketService from '@/services/socket'

export function useChatSocket(chatId: string, onMessage: (msg: any) => void) {
  useEffect(() => {
    const socketService = SocketService.getInstance()

    socketService.connect()
    socketService.joinChat(chatId)

    socketService.onNewMessage(onMessage)

    return () => {
      socketService.offNewMessage(onMessage)
      socketService.disconnect()
    }
  }, [chatId])
}
