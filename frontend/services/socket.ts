import { io, Socket } from 'socket.io-client'
import { AuthStorageService } from './authStorageService'

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL

interface ServerToClientEvents {
  message: (data: {
    id: string
    chat_id: string
    user_id: string
    type: string
    content: string
    created_at: string
  }) => void
}

interface ClientToServerEvents {
  join_chat: (chatId: string) => void
  send_message: (data: { chatId: string; text: string }) => void
}

class SocketService {
  private static instance: SocketService
  private socket!: Socket

  private constructor(userId: string) {
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: false,
      auth: { userId }
    })
  }

  public static getInstance(userId: string): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService(userId)
    }
    return SocketService.instance
  }

  connect() {
    if (!this.socket.connected) {
      this.socket.connect()
      console.log('[Socket] Conectado ao servidor')
    }
  }

  disconnect() {
    if (this.socket.connected) {
      this.socket.disconnect()
      console.log('[Socket] Desconectado do servidor')
    }
  }

  joinChat(chatId: string) {
    this.socket.emit('join_chat', chatId)
    console.log(`[Socket] Entrou na sala chat:${chatId}`)
  }

  sendMessage(chatId: string, text: string) {
    this.socket.emit('send_message', { chatId, text })
  }

  onMessage(callback: (...args: Parameters<ServerToClientEvents['message']>) => void) {
    this.socket.on('message', callback)
  }

  offMessage(callback: (...args: Parameters<ServerToClientEvents['message']>) => void) {
    this.socket.off('message', callback)
  }

  getSocket() {
    return this.socket
  }
}

export default SocketService
