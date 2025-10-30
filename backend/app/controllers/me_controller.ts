import type { HttpContext } from '@adonisjs/core/http'

import ResponseService from "#services/response_service"
import UserService from '#services/user_service'
import { changePasswordValidator, updateUserValidator } from '#validators/me_validator'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import { inject } from '@adonisjs/core'
import path from 'path'
import fs from 'fs'
import sharp from 'sharp'

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
            var profileImageUrl: string | undefined

            if (payload.profile_image) {
                if (user.profile_image_url) {
                    const oldPath = path.join(app.makePath('storage/profile_images'), path.basename(user.profile_image_url))
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath)
                    }
                }
                const fileName = `${cuid()}.webp`
                const outputPath = path.join(app.makePath('storage/profile_images'), fileName)

                await sharp(payload.profile_image.tmpPath!)
                    .toFormat('webp', { quality: 80 })
                    .toFile(outputPath)

                profileImageUrl = `/uploads/profile_images/${fileName}`
            } else {
                if (user.profile_image_url) {
                    const oldPath = path.join(app.makePath('storage/profile_images'), path.basename(user.profile_image_url))
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath)
                    }
                    user.profile_image_url = null
                    await user.save()
                }
            }

            const res = await this.userService.update(user, { ...payload, bio: payload.bio ? payload.bio : '', profile_image_url: profileImageUrl })
            ResponseService.send(response, 200, 'Usuário atualizado com sucesso.', { user: { ...res } })
        } catch (error) {
            ResponseService.error(response, error)
        }
    }

    public async changePassword({ response, request, auth }: HttpContext) {
        try {
            const payload = await request.validateUsing(changePasswordValidator)
            const user = await auth.authenticateUsing(['api'])

            user.merge({
                password: payload.password
            })
            await user.save()

            ResponseService.send(response, 200, 'Senha alterada com sucesso.', { user })
        } catch (err) {
            ResponseService.error(response, err)
        }
    }

    public async delete({ response, auth }: HttpContext) {
        const user = await auth.authenticateUsing(['api'])

        if (!user) {
            ResponseService.send(response, 401, 'Usuário deletado com sucesso!', { errors: { auth: 'Credenciais inválidas.' } })
            return
        }

        await this.userService.delete(user)
        ResponseService.send(response, 200, 'Usuário deletado com sucesso!', { user })
    }
}