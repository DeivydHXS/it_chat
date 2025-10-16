import ChatService from '#services/chat_service'
import ResponseService from '#services/response_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ChatsController {
    constructor(
        private chatService: ChatService
    ) { }

    public async all({ response, auth }: HttpContext) {
        try {
            const currentUser = await auth.authenticateUsing(['api'])

            await currentUser.load('chats', (query) => {
                query.preload('users')
            })

            return ResponseService.send(response, 200, 'Lista de conversas.', { chats: currentUser.chats })
        } catch (err) {
            ResponseService.error(response, err)
        }
    }

    public async get({ response, params, auth }: HttpContext) {
        try {
            const currentUser = await auth.authenticateUsing(['api'])
            const chatId = params.chatId

            const chat = await this.chatService.get(chatId)

            return ResponseService.send(response, 200, 'Conversa.', { chat })
        } catch (err) {
            ResponseService.error(response, err)
        }
    }
}