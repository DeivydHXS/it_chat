import { io, Socket } from "socket.io-client"

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL

interface ServerToClientEvents {
  message: (data: { from: string; text: string }) => void
  onlineUsers: (users: string[]) => void
}

interface ClientToServerEvents {
  sendMessage: (data: { to: string; text: string }) => void
  joinRoom: (roomId: string) => void
}

class SocketService {
  private static instance: SocketService
  private socket: Socket<ServerToClientEvents, ClientToServerEvents>

  private constructor() {
    this.socket = io(SOCKET_URL, {
      transports: ["websocket"],
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
    }
  }

  disconnect() {
    if (this.socket.connected) {
      this.socket.disconnect()
    }
  }

  getSocket() {
    return this.socket
  }
}

export default SocketService
