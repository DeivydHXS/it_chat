import type { HttpContext } from '@adonisjs/core/http'
import { registerAuthValidator } from '#validators/auth_validator'
import UserService from '#services/user_service'
import { inject } from '@adonisjs/core'
import User from '#models/user'
import ResponseService from '#services/response_service'

@inject()
export default class AuthController {
    constructor(
        private userService: UserService
    ) { }

    public async register({ request, response }: HttpContext) {
        try {
            const { password_confirmation, ...payload } = await request.validateUsing(registerAuthValidator)
            const user = await this.userService.store({ ...payload, birthday: payload.birthday.toISOString() })
            const token = await User.accessTokens.create(user)

            ResponseService.send(response, 201, 'Usuário criado com sucesso!', {
                user,
                token: {
                    access_token: token.value!.release(),
                    expires_at: token.expiresAt,
                    created_at: token.createdAt
                }
            })
        } catch (error) {
            console.log(error)
            ResponseService.send(response, 422, 'Campos obrigatórios inválidos.', error)
        }
    }
}