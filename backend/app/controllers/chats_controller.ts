import ChatService from '#services/chat_service'
import ResponseService from '#services/response_service'
import { createGroupValidator } from '#validators/chat_validator'
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

            const chats = await currentUser
                .related('chats')
                .query()
                .preload('users')
                .where('type', 'p')

            for (const chat of chats) {
                const lastMessage = await chat
                    .related('messages')
                    .query()
                    .orderBy('created_at', 'desc')
                    .limit(1)
                chat.$setRelated('messages', lastMessage)
            }

            const serializedChats = chats
                .map((chat) => {
                    const s = chat.serialize()
                    const lastMessage = s.messages?.[0] || null
                    delete s.messages
                    return { ...s, last_message: lastMessage }
                })
                .sort((a, b) => {
                    if (!a.last_message) return 1
                    if (!b.last_message) return -1
                    return new Date(b.last_message.createdAt).getTime() - new Date(a.last_message.createdAt).getTime()
                })

            return ResponseService.send(response, 200, 'Lista de conversas.', { chats: serializedChats })
        } catch (err) {
            ResponseService.error(response, err)
        }
    }

    public async allGroups({ response, params, auth }: HttpContext) {
        try {
            const currentUser = await auth.authenticateUsing(['api'])
            const groups = await currentUser
                .related('chats')
                .query()
                .preload('users')
                .where('type', 'g')

            return ResponseService.send(response, 200, 'Conversa.', { groups })
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

    public async store({ response, request, auth }: HttpContext) {
        try {
            const payload = await request.validateUsing(createGroupValidator)
            const currentUser = await auth.authenticateUsing(['api'])

            const group = await this.chatService.createGroupChat(currentUser.id, payload.name, payload.description)

            return ResponseService.send(response, 200, 'Conversa.', { group })
        } catch (err) {
            ResponseService.error(response, err)
        }
    }
}