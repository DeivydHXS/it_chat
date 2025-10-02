import type { HttpContext } from '@adonisjs/core/http'

import ResponseService from "#services/response_service"
import UserService from '#services/user_service'
import { updateUserValidator } from '#validators/me_validator'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import { inject } from '@adonisjs/core'
import path from 'path'
import fs from 'fs'

@inject()
export default class MeController {
    constructor(
        private userService: UserService
    ) { }

    public async get({ response, auth }: HttpContext) {
        try {
            const user = await auth.authenticateUsing(['api'])
            ResponseService.send(response, 200, 'Perfil de usuário.', { user })
        } catch (err) {
            ResponseService.error(response, err)
        }
    }

    public async update({ request, response, auth }: HttpContext) {
        try {
            const payload = await request.validateUsing(updateUserValidator)
            const user = await auth.authenticateUsing(['api'])

            if (payload.profile_image) {
                if (user.profile_image_url) {
                    const oldPath = path.join(app.makePath('storage/profile_images'), path.basename(user.profile_image_url))
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath)
                    }
                }

                await payload.profile_image.move(app.makePath('storage/profile_images'), {
                    name: `${cuid()}.${payload.profile_image.extname}`
                })
            }

            const res = await this.userService.update(user, { ...payload, profile_image_url: payload.profile_image ? `/uploads/profile_images/${payload.profile_image?.fileName}` : undefined })

            ResponseService.send(response, 200, 'Usuário atualizado com sucesso.', { user: {...res} })
        } catch (error) {
            ResponseService.error(response, error)
        }
    }

    public async delete({ response, auth }: HttpContext) {
        const user = await auth.authenticateUsing(['api'])

        await this.userService.delete(user)

        ResponseService.send(response, 200, 'Conta de usuário deletada.', { user })
    }
}