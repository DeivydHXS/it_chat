import { errors as adonisErrors } from '@adonisjs/auth'
import { errors } from '@vinejs/vine'

export default class ResponseService {
    public static async send(response: any, status: number, message: string, data: object) {
        const isStatusValid = status >= 200 && status <= 300 ? true : false

        if (!isStatusValid) {
            if (data instanceof errors.E_VALIDATION_ERROR) {
                var errorsList: any = {}
                // @ts-ignore
                data.messages.forEach(bag => {
                    errorsList[bag.field] = String(bag.message)
                });
                response.status(status).json({
                    message,
                    errorsList
                })
            }
            else if (data instanceof adonisErrors.E_INVALID_CREDENTIALS) {
                response.status(status).json({
                    message,
                    error: 'Email e/ou senha inválido(s).'
                })
            }
            return
        }

        response.status(status).json({
            message,
            data
        })
    }
}