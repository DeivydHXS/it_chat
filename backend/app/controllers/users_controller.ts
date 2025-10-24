import ResponseService from '#services/response_service'
import UserService from '#services/user_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class UsersController {
    constructor(
        private userService: UserService
    ) { }

    public async search({ response, request, auth }: HttpContext) {
        try {
            const user = await auth.authenticateUsing(['api'])
            const search = request.input('search')

            const users = await this.userService.search(search, user.id)
            ResponseService.send(response, 200, 'Busca de usuário.', { users })
        } catch (err) {
            ResponseService.error(response, err)
        }
    }

    public async get({ response, params }: HttpContext) {
        try {
            const id = params.id
            const user = await this.userService.findById(id)

            if (!user) {
                ResponseService.send(response, 404, 'Usuário não encontrado.', { user })
            }

            ResponseService.send(response, 200, 'Usuário encontrado com sucesso.', { user })
        } catch (err) {
            ResponseService.error(response, err)
        }
    }
}