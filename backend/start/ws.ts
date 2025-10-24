import app from '@adonisjs/core/services/app'
import Ws from '#services/ws_service'

app.ready(() => {
  Ws.boot()

  Ws.io?.on('connection', (socket) => {
    const userId = socket.handshake.auth.userId
    if (!userId) {
      // console.log('Usuário não enviado no handshake, desconectando socket')
      socket.disconnect()
      return
    }

    // console.log('Usuário conectado via socket:', userId)
    socket.data.userId = userId

    socket.on('join_chat', (chatId: string) => {
      socket.join(`chat:${chatId}`)
      // console.log(`Socket ${socket.id} entrou na sala chat:${chatId}`)
    })

    socket.on('join_user', (userId) => {
      socket.join(`user:${userId}`)
    })

  })
})
