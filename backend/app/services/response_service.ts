import { errors as adonisErrors } from '@adonisjs/auth'
import { errors } from '@vinejs/vine'

export default class ResponseService {
    public static async send(response: any, status: number, message: string, data: any) {
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
            errors: data
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
                ResponseService.send(response, 401, 'Não autorizado.', { error: 'Email e/ou senha inválido(s).' })
                break
            default:
                ResponseService.send(response, 400, 'Erro desconhecido.', error)
                break
        }
    }
}