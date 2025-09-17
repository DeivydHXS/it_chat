import type { HttpContext } from '@adonisjs/core/http'

import ResponseService from "#services/response_service"

export default class MeController {
    public async me({ response, auth }: HttpContext) {
        const user = await auth.authenticateUsing(['api'])

        ResponseService.send(response, 200, 'Perfil de usuário.', { user })
    }
}