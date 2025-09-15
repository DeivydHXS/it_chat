import type { HttpContext } from '@adonisjs/core/http'
import { registerAuthValidator, loginAuthValidation } from '#validators/auth_validator'
import UserService from '#services/user_service'
import { inject } from '@adonisjs/core'
import User from '#models/user'
import ResponseService from '#services/response_service'
import SessionService from '#services/session_service'
import { errors as adonisErrors } from '@adonisjs/auth'
import { errors } from '@vinejs/vine'

@inject()
export default class AuthController {
    constructor(
        private userService: UserService,
        private sessionService: SessionService
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
            if (error instanceof errors.E_VALIDATION_ERROR)
                ResponseService.send(response, 422, 'Campos obrigatórios inválidos.', error)
        }
    }

    public async login({ request, response, auth }: HttpContext) {
        try {
            const payload = await request.validateUsing(loginAuthValidation)
            const { user, token } = await this.sessionService.store(payload, auth)

            ResponseService.send(response, 200, 'Login realizado com sucesso!', {
                user,
                token: {
                    access_token: token.value!.release(),
                    expires_at: token.expiresAt,
                    created_at: token.createdAt
                }
            })
        } catch (error) {
            if (error instanceof errors.E_VALIDATION_ERROR)
                ResponseService.send(response, 422, 'Campos obrigatórios inválidos.', error)
            else if (error instanceof adonisErrors.E_INVALID_CREDENTIALS)
                ResponseService.send(response, 401, 'Email e/ou senha inválido(s).', error)

        }
    }
}