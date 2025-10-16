import { io, Socket } from 'socket.io-client'

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL

interface ServerToClientEvents {
  receive_message: (data: {
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
}

class SocketService {
  private static instance: SocketService
  private socket: Socket<ServerToClientEvents, ClientToServerEvents>

  private constructor() {
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: false,
    })
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService()
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

  onNewMessage(callback: (...args: Parameters<ServerToClientEvents['receive_message']>) => void) {
    this.socket.on('receive_message', callback)
  }

  offNewMessage(callback: (...args: Parameters<ServerToClientEvents['receive_message']>) => void) {
    this.socket.off('receive_message', callback)
  }

  getSocket() {
    return this.socket
  }
}

export default SocketService
