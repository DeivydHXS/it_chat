import User from "#models/user";
import { TransactionClientContract } from "@adonisjs/lucid/types/database";
import mail from '@adonisjs/mail/services/main'
import { randomInt } from "crypto";
import path from 'path'
import fs from 'fs'
import app from "@adonisjs/core/services/app";
import { UUIDTypes } from "uuid";

export default class UserService {
    public static formatUserResponse(user: User) {
        return {
            ...user.serialize(),
            bio: user.bio ?? null,
            profile_image_url: user.profile_image_url ?? null,
        }
    }

    public async search(search: string) {
        const users = await User.query()
            .if(search, (query) => {
                query.where((q) => {
                    q.whereILike('name', `%${search}%`)
                        .orWhereILike('nickname', `%${search}%`)
                        .orWhereILike('nickname_hash', `%${search}%`)
                })
            })
            .orderBy('created_at', 'desc')

        return users
    }

    public async friendsSearch(user: User, search: string) {
        const friends = await user.related('friendships').query()
            .if(search, (query) => {
                query.where((q) => {
                    q.whereILike('name', `%${search}%`)
                        .orWhereILike('nickname', `%${search}%`)
                        .orWhereILike('nickname_hash', `%${search}%`)
                })
            })
            .orderBy('created_at', 'desc')

        return friends
    }

    public async findById(id: UUIDTypes) {
        const user = await User.find(id)
        return user ? UserService.formatUserResponse(user) : null
    }

    public async store(payload: Partial<User>, trx?: TransactionClientContract) {
        const user = await User.create(payload, { client: trx })

        if (!trx) {
            const verification_code = randomInt(100000, 999999)
            user.verification_code = verification_code
            user.save()
            // await mail.send((message) => {
            //     message
            //         .to(user.email)
            //         .subject('Código de verificação')
            //         .text(`${verification_code}`)
            // })
            console.log(verification_code)
        }

        return UserService.formatUserResponse(user)
    }

    public async update(user: User, { profile_image, ...payload }: { name?: string, nickname?: string, bio?: string, profile_image_url?: string, profile_image?: any, }, trx?: TransactionClientContract) {
        if (payload) {
            if (!payload.profile_image_url) {
                user.merge({
                    ...payload,
                    profile_image_url: user.profile_image_url
                })
                await user.save()
            } else {
                user.merge(payload)
                await user.save()
            }
        }
        return UserService.formatUserResponse(user)
    }

    public async delete(user: User) {
        if (user.profile_image_url) {
            const oldPath = path.join(app.makePath('storage/uploads'), path.basename(user.profile_image_url))
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath)
            }
        }

        user.delete()
    }

    public async verifyAccount(email: string, code: number) {
        const user = await User.findBy('email', email)

        if (user?.verification_code !== code) {
            throw { errors: { error: 'Erro ao verificar e-mail, tente novamente mais tarde.' } }
        }

        user.status = 'a'
        user.verification_code = null
        user.save()

        return true
    }

    public async sendPasswordRecoverCode(email: string) {
        const user = await User.findBy('email', email)
        if (user) {
            const verification_code = randomInt(100000, 999999)
            user.verification_code = verification_code
            user.save()

            // await mail.send((message) => {
            //     message
            //         .to(user.email)
            //         .subject('Código de verificação')
            //         .text(`${verification_code}`)
            // })
            console.log(verification_code)

            return
        }

        throw { errors: 'Erro inesperado.' }
    }

    public async verifyCode(email: string, code: number) {
        const user = await User.findBy('email', email)

        if (user?.verification_code !== code) {
            throw { message: 'Campos obrigatórios inválidos.', errors: { code: 'Código inválido.' } }
        }
    }

    public async changePassword(email: string, code: number, password: string) {
        const user = await User.findBy('email', email)

        if (user?.verification_code !== code) {
            throw { message: 'Não autorizado.', errors: { code: 'Erro ao validar código.' } }
        }

        user.merge({
            password,
            verification_code: null
        })
        await user.save()
    }
}