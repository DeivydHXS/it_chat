import app from '@adonisjs/core/services/app'
import Ws from '#services/ws_service'

app.ready(() => {
  Ws.boot()

  Ws.io?.on('connection', (socket) => {
    console.log('Socket conectado:', socket.id)

    socket.on('join_chat', (chatId: string) => {
      socket.join(`chat:${chatId}`)
      console.log(`Socket ${socket.id} joined room chat:${chatId}`)
    })
  })
})
