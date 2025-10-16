import Message from '#models/message'
import Ws from '#services/ws_service'
import ResponseService from '#services/response_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class MessagesController {
  constructor() {}

  public async index({ response, params }: HttpContext) {
    try {
      const { chatId } = params

      const messages = await Message.query()
        .where('chat_id', chatId)
        .orderBy('created_at', 'asc')

      ResponseService.send(response, 200, 'Histórico de mensagens.', { messages })
    } catch (err) {
      ResponseService.error(response, err)
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const { chat_id, user_id, type, content } = request.only([
        'chat_id',
        'user_id',
        'type',
        'content',
      ])

      const message = await Message.create({
        chat_id,
        user_id,
        type,
        content,
      })

      Ws.io?.to(`chat:${chat_id}`).emit('receive_message', message)

      ResponseService.send(response, 200, 'Mensagem salva e emitida em tempo real.', { message })
    } catch (err) {
      ResponseService.error(response, err)
    }
  }
}
