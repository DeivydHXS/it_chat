import { HttpContext } from '@adonisjs/core/http'
import ResponseService from '#services/response_service'
import Message from '#models/message'
import Ws from '#services/ws_service'
import Chat from '#models/chat'

export default class MessagesController {
  public async index({ response, params }: HttpContext) {
    try {
      const { chatId } = params
      const messages = await Message.query()
        .where('chat_id', chatId)
        .preload('user')
        .orderBy('created_at', 'asc')

        ResponseService.send(response, 200, 'Histórico de mensagens', { messages })
    } catch (err) {
      ResponseService.error(response, err)
    }
  }

  public async store({ request, response, params, auth }: HttpContext) {
    try {
      const currentUser = await auth.authenticate()
      const { chatId } = params
      const { type, content } = request.only(['type', 'content'])

      const message = await Message.create({
        chat_id: chatId,
        user_id: currentUser.id,
        type: type,
        content: content,
      })

      await message.load('user')

      Ws.io?.to(`chat:${chatId}`).emit('message', message)

      const chat = await Chat.query()
        .where('id', message.chat_id)
        .preload('users')
        .firstOrFail()

      for (const user of chat.users) {
        Ws.io?.to(`user:${user.id}`).emit('new_message', { message: { ...message.serialize() } })
      }

      ResponseService.send(response, 200, 'Mensagem enviada.', { message })
    } catch (err) {
      ResponseService.error(response, err)
    }
  }

  public async delete({ response, params, auth }: HttpContext) {
    try {
      const currentUser = await auth.authenticate()
      const { messageId } = params

      const message = await Message.find(messageId)

      if (!message) {
        ResponseService.send(response, 404, 'Mensagem não encontrada.', {})
        return
      }

      if (message?.user_id !== currentUser.id) {
        ResponseService.send(response, 403, 'Você não é o dono dessa mensagem.', {})
        return
      }

      message?.merge({
        deleted: true
      })
      await message?.save()

      ResponseService.send(response, 200, 'Mensagem deleteda com sucesso.')
    } catch (err) {
      ResponseService.error(response, err)
    }
  }
}
