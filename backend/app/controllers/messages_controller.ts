import { HttpContext } from '@adonisjs/core/http'
import ResponseService from '#services/response_service'
import Message from '#models/message'
import Ws from '#services/ws_service'

export default class MessagesController {
  public async index({ response, params }: HttpContext) {
    try {
      const { chatId } = params
      const messages = await Message.query()
        .where('chat_id', chatId)
        .orderBy('created_at', 'asc')

      ResponseService.send(response, 200, 'Histórico de mensagens', { messages })
    } catch (err) {
      ResponseService.error(response, err)
    }
  }

  public async store({ request, response, auth }: HttpContext) {
    try {
      const currentUser = await auth.authenticate()
      const { chatId, text } = request.only(['chatId', 'text'])

      const message = await Message.create({
        chat_id: chatId,
        user_id: currentUser.id,
        type: 'text',
        content: text,
      })

      Ws.io?.to(`chat:${chatId}`).emit('message', message)

      ResponseService.send(response, 200, 'Mensagem salva e emitida', { message })
    } catch (err) {
      ResponseService.error(response, err)
    }
  }
}
