import { io, Socket } from 'socket.io-client'
import { MessageInterface } from '@/interfaces/chat-interfaces'

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL

interface ServerToClientEvents {
  message: (data: MessageInterface) => void
  new_message: (data: MessageInterface) => void
}

interface ClientToServerEvents {
  join_chat: (chatId: string) => void
  join_user: (userId: string) => void
  send_message: (data: { chatId: string; text: string }) => void
}

class SocketService {
  private static instance: SocketService
  private socket!: Socket<ServerToClientEvents, ClientToServerEvents>
  private userId: string

  private constructor(userId: string) {
    this.userId = userId
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: false,
      auth: { userId },
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

      this.socket.on('connect', () => {
        console.log('[Socket] Conectado ao servidor')
        this.joinUser(this.userId)
      })
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

  joinUser(userId: string) {
    this.socket.emit('join_user', userId)
    console.log(`[Socket] Entrou na sala user:${userId}`)
  }

  async sendMessage(chatId: string, text: string) {
    await new Promise((resolve) => {
      this.socket.emit('send_message', { chatId, text })
      resolve(true)
    })
  }

  onMessage(callback: (...args: Parameters<ServerToClientEvents['message']>) => void) {
    this.socket.on('message', callback)
  }

  offMessage(callback: (...args: Parameters<ServerToClientEvents['message']>) => void) {
    this.socket.off('message', callback)
  }

  onNewMessage(callback: (...args: Parameters<ServerToClientEvents['new_message']>) => void) {
    this.socket.on('new_message', callback)
  }

  offNewMessage(callback: (...args: Parameters<ServerToClientEvents['new_message']>) => void) {
    this.socket.off('new_message', callback)
  }

  getSocket() {
    return this.socket
  }
}

export default SocketService
