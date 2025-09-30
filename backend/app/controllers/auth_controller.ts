import type { HttpContext } from '@adonisjs/core/http'
import { registerAuthValidator, loginAuthValidation, codeVerificationValidator, forgotPasswordValidator, changePasswordValidator, isEmailNotUsedValidator } from '#validators/auth_validator'
import UserService from '#services/user_service'
import { inject } from '@adonisjs/core'
import ResponseService from '#services/response_service'
import SessionService from '#services/session_service'
import User from '#models/user'

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

            ResponseService.send(response, 201, 'Usuário criado com sucesso!', {
                user
            })
        } catch (error) {
            ResponseService.error(response, error)
        }
    }

    public async isEmailNotUsed({ request, response }: HttpContext) {
        try {
            const { email } = await request.validateUsing(isEmailNotUsedValidator)
            const user = await User.findBy('email', email)
            if (user) {
                ResponseService.send(response, 409, 'Campos obrigatórios inválidos.', { email: 'Email já registrado no sistema.' })
                return
            }

            ResponseService.send(response, 200, 'Email não registrado.')
        } catch (error) {
            ResponseService.error(response, error)
        }
    }

    public async login({ request, response, auth }: HttpContext) {
        try {
            const payload = await request.validateUsing(loginAuthValidation)
            const { user, token } = await this.sessionService.store(payload, auth)

            ResponseService.send(response, 200, 'Login realizado com sucesso!', {
                user,
                token
            })
        } catch (error) {
            ResponseService.error(response, error)
        }
    }

    public async logout({ response, auth }: HttpContext) {
        try {
            await this.sessionService.destroy(auth)
            ResponseService.send(response, 200, 'Logout realizado com sucesso.')
        } catch (error) {
            ResponseService.error(response, error)
        }
    }

    public async verifyEmail({ request, response }: HttpContext) {
        try {
            const { email, code } = await request.validateUsing(codeVerificationValidator)
            await this.userService.verifyAccount(email, code)
            ResponseService.send(response, 200, 'E-mail confirmado com sucesso!')
        } catch (error) {
            ResponseService.error(response, error)
        }
    }

    public async getVerificationCode({ request, response }: HttpContext) {
        try {
            const { email } = await request.validateUsing(forgotPasswordValidator)
            const user = await User.findBy('email', email)
            ResponseService.send(response, 200, 'Sucesso ao verificar conta.', { code: user?.verification_code })
        } catch (error) {
            ResponseService.error(response, error)
        }
    }

    public async forgotPassword({ request, response }: HttpContext) {
        try {
            const { email } = await request.validateUsing(forgotPasswordValidator)
            await this.userService.sendPasswordRecoverCode(email)
            ResponseService.send(response, 200, 'E-mail de recuperação enviado com sucesso!', { email })
        } catch (error) {
            ResponseService.error(response, error)
        }
    }

    public async codeVerification({ request, response }: HttpContext) {
        try {
            const { email, code } = await request.validateUsing(codeVerificationValidator)
            await this.userService.verifyCode(email, code)
            ResponseService.send(response, 200, 'Código válidado com sucesso.')
        } catch (error) {
            ResponseService.error(response, error)
        }
    }

    public async changePassword({ request, response }: HttpContext) {
        try {
            const { email, code, password } = await request.validateUsing(changePasswordValidator)
            await this.userService.changePassword(email, code, password)
            ResponseService.send(response, 200, 'Senha redefinida com sucesso!')
        } catch (error) {
            ResponseService.error(response, error)
        }
    }
}