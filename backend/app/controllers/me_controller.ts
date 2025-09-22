import type { HttpContext } from '@adonisjs/core/http'

import ResponseService from "#services/response_service"
import UserService from '#services/user_service'
import { updateUserValidator } from '#validators/me_validator'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import { inject } from '@adonisjs/core'

@inject()
export default class MeController {
    constructor(
        private userService: UserService
    ) { }

    public async get({ response, auth }: HttpContext) {
        const user = await auth.authenticateUsing(['api'])

        ResponseService.send(response, 200, 'Perfil de usuário.', { user })
    }

    public async update({ request, response, auth }: HttpContext) {
        try {
            const payload = await request.validateUsing(updateUserValidator)
            const user = await auth.authenticateUsing(['api'])

            if (!payload) {
                ResponseService.error(response, { error: 'É necessario pelo menos um campo preenchido para atualizar.' })
            }

            if (payload.profile_image) {
                await payload.profile_image.move(app.makePath('storage/uploads'), {
                    name: `${cuid()}.${payload.profile_image.extname}`
                })
            }

            const res = await this.userService.update(user, { ...payload, profile_image_url: payload.profile_image?.filePath })

            ResponseService.send(response, 200, 'Usuário atualizado com sucesso.', { user })
        } catch (error) {
            ResponseService.error(response, error)
        }
    }

    public async delete({ response, auth }: HttpContext) {
        const user = await auth.authenticateUsing(['api'])

        ResponseService.send(response, 200, 'Conta de usuário deletada.', { user })
    }
}