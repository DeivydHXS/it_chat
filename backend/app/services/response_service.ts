import { errors as adonisErrors } from '@adonisjs/auth'
import { errors } from '@vinejs/vine'

export default class ResponseService {
    public static async send(response: any, status: number, message?: string, data?: any) {
        // console.log('mensagem:', message)
        // console.log('data:', data)
        const isStatusValid = status >= 200 && status <= 300 ? true : false

        if (isStatusValid) {
            response.status(status).json({
                message,
                data
            })
            return
        }

        if (data['error']) {
            response.status(status).json({
                message,
                ...data
            })
            return
        }

        response.status(status).json({
            message,
            errors: { ...data }
        })
    }

    public static async error(response: any, error: any) {
        switch (error.constructor) {
            case errors.E_VALIDATION_ERROR:
                let errorMessages: any = {}
                // @ts-ignore
                error.messages.forEach(bag => {
                    errorMessages[bag.field] = String(bag.message)
                });
                ResponseService.send(response, 422, 'Campos obrigatórios inválidos.', errorMessages)
                break
            case adonisErrors.E_INVALID_CREDENTIALS:
                ResponseService.send(response, 422, 'Campos obrigatórios inválidos.', {
                    email: 'Email e/ou senha inválido(s).',
                    password: 'Email e/ou senha inválido(s).'
                })
                break
            case adonisErrors.E_UNAUTHORIZED_ACCESS:
                ResponseService.send(response, 401, 'Não autorizado.', {
                    auth: 'Credenciais inválidas.'
                })
                break
            default:
                ResponseService.send(response, 400, error.message, error.errors)
                break
        }
    }
}