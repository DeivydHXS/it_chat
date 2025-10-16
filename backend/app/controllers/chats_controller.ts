import ResponseService from '#services/response_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class ChatsController {
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
}