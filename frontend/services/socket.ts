import { io, Socket } from 'socket.io-client'
import { MessageInterface } from '@/interfaces/chat-interfaces'

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL

interface ServerToClientEvents {
  message: (data: MessageInterface) => void
  new_message: (data: MessageInterface) => void
  friend_requests_update: (data: { total: number }) => void
  messages_unread_update: (data: { total: number; chatId: string }) => void
}

interface ClientToServerEvents {
  join_chat: (chatId: string) => void
  join_user: (userId: string) => void
  send_message: (data: { chatId: string; text: string }) => void
  mark_messages_as_read: (data: { chatId: string }) => void
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
    if (!SocketService.instance || SocketService.instance.userId !== userId) {
      if (SocketService.instance) {
        SocketService.instance.disconnect()
      }
      SocketService.instance = new SocketService(userId)
    }
    return SocketService.instance
  }

  connect() {
    if (!this.socket.connected) {
      this.socket.connect()

      this.socket.on('connect', () => {
        this.joinUser(this.userId)
      })
    }
  }

  disconnect() {
    if (this.socket.connected) {
      this.socket.disconnect()
    }
  }

  joinChat(chatId: string) {
    this.socket.emit('join_chat', chatId)
  }

  joinUser(userId: string) {
    this.socket.emit('join_user', userId)
  }

  async sendMessage(chatId: string, text: string) {
    await new Promise((resolve) => {
      this.socket.emit('send_message', { chatId, text })
      resolve(true)
    })
  }

  markMessagesAsRead(chatId: string) {
    this.socket.emit('mark_messages_as_read', { chatId })
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

  onFriendRequestsUpdate(
    callback: (...args: Parameters<ServerToClientEvents['friend_requests_update']>) => void
  ) {
    this.socket.on('friend_requests_update', callback)
  }

  offFriendRequestsUpdate(
    callback: (...args: Parameters<ServerToClientEvents['friend_requests_update']>) => void
  ) {
    this.socket.off('friend_requests_update', callback)
  }

  onMessagesUnreadUpdate(callback: (data: { chatId: string; total: number }) => void) {
    this.socket?.on('messages_unread_update', callback)
  }

  offMessagesUnreadUpdate(callback: (data: any) => void) {
    this.socket?.off('messages_unread_update', callback)
  }

  getSocket() {
    return this.socket
  }
}

export default SocketService
