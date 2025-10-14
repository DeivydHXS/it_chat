import ResponseService from '#services/response_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class UsersController {
    constructor(
    ) { }

    public async index({ response, request }: HttpContext) {
        try {
            
            ResponseService.send(response, 200, 'Histórico de mensagens.', {  })
        } catch (err) {
            ResponseService.error(response, err)
        }
    }

    public async store({ response, params }: HttpContext) {
        try {

            ResponseService.send(response, 200, 'Mensagem salva.', {  })
        } catch (err) {
            ResponseService.error(response, err)
        }
    }
}