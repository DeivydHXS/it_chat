import { Server } from 'socket.io'
import server from '@adonisjs/core/services/server'
import Message from '#models/message'

class Ws {
  public io: Server | undefined
  private booted = false

  boot() {
    if (this.booted) return
    this.booted = true

    this.io = new Server(server.getNodeServer(), {
      cors: { origin: '*' },
    })
  }

  sendMessage(chatId: string, message: Message) {
    this.io?.to(`chat:${chatId}`).emit('message', message)
  }
}

export default new Ws()
