import Chat from '#models/chat'
import { UserChatsPermissionTypes } from '#models/user_chats'
import ChatService from '#services/chat_service'
import ResponseService from '#services/response_service'
import { createGroupValidator, updateGroupValidator } from '#validators/chat_validator'
import { inject } from '@adonisjs/core'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import path from 'path'
import sharp from 'sharp'
import { v4 } from 'uuid'
import fs from 'fs'
import { group } from 'console'

@inject()
export default class ChatsController {
    constructor(
        private chatService: ChatService
    ) { }

    public async all({ response, auth }: HttpContext) {
        try {
            const currentUser = await auth.authenticateUsing(['api'])

            const chats = await currentUser
                .related('chats')
                .query()
                .preload('users')
                .where('type', 'p')

            for (const chat of chats) {
                const lastMessage = await chat
                    .related('messages')
                    .query()
                    .orderBy('created_at', 'desc')
                    .limit(1)
                chat.$setRelated('messages', lastMessage)
            }

            const serializedChats = chats
                .map((chat) => {
                    const s = chat.serialize()
                    const lastMessage = s.messages?.[0] || null
                    delete s.messages
                    return { ...s, last_message: lastMessage }
                })
                .sort((a, b) => {
                    if (!a.last_message) return 1
                    if (!b.last_message) return -1
                    return new Date(b.last_message.createdAt).getTime() - new Date(a.last_message.createdAt).getTime()
                })

            return ResponseService.send(response, 200, 'Lista de conversas.', { chats: serializedChats })
        } catch (err) {
            ResponseService.error(response, err)
        }
    }

    public async allGroups({ response, params, auth }: HttpContext) {
        try {
            const currentUser = await auth.authenticateUsing(['api'])
            const groups = await currentUser
                .related('chats')
                .query()
                .preload('users')
                .where('type', 'g')

            return ResponseService.send(response, 200, 'Conversa.', { groups })
        } catch (err) {
            ResponseService.error(response, err)
        }
    }

    public async get({ response, request, params, auth }: HttpContext) {
        try {
            const currentUser = await auth.authenticateUsing(['api'])
            const chatId = params.chatId || request.input('chatId')

            const chat = await this.chatService.get(chatId)

            return ResponseService.send(response, 200, 'Conversa.', { chat })
        } catch (err) {
            ResponseService.error(response, err)
        }
    }

    public async getGroup({ response, request, params, auth }: HttpContext) {
        try {
            const currentUser = await auth.authenticateUsing(['api'])
            const chatId = params.chatId || request.input('chatId')

            const group = await this.chatService.getGroup(chatId)

            return ResponseService.send(response, 200, 'Grupo.', { group })
        } catch (err) {
            ResponseService.error(response, err)
        }
    }

    public async store({ response, request, auth }: HttpContext) {
        try {
            const payload = await request.validateUsing(createGroupValidator)
            const currentUser = await auth.authenticateUsing(['api'])
            var iconImageUrl: string | undefined
            var coverImageUrl: string | undefined

            if (payload.icon_image) {
                const fileName = `${cuid()}.webp`
                const outputPath = path.join(app.makePath('storage/icon_images'), fileName)

                await sharp(payload.icon_image.tmpPath!)
                    .toFormat('webp', { quality: 80 })
                    .toFile(outputPath)

                iconImageUrl = `/uploads/icon_images/${fileName}`
            }

            if (payload.cover_image) {
                const fileName = `${cuid()}.webp`
                const outputPath = path.join(app.makePath('storage/cover_images'), fileName)

                await sharp(payload.cover_image.tmpPath!)
                    .toFormat('webp', { quality: 80 })
                    .toFile(outputPath)

                coverImageUrl = `/uploads/cover_images/${fileName}`
            }

            const group = await this.chatService.createGroupChat(currentUser.id, { name: payload.name, description: payload.description, icon_image_url: iconImageUrl, cover_image_url: coverImageUrl })

            return ResponseService.send(response, 200, 'Conversa.', { group })
        } catch (err) {
            ResponseService.error(response, err)
        }
    }

    public async update({ response, request, params, auth }: HttpContext) {
        try {
            const payload = await request.validateUsing(updateGroupValidator)
            const currentUser = await auth.authenticateUsing(['api'])
            const groupId = params.chatId || request.input('chatId')
            var iconImageUrl: string | undefined
            var coverImageUrl: string | undefined

            const oldGroup = await Chat.query().where('id', groupId).first()

            if (!oldGroup) {
                return ResponseService.send(response, 404, 'Grupo não encontrado.')
            }

            if (payload.icon_image) {
                if (oldGroup?.icon_image_url) {
                    const oldPath = path.join(app.makePath('storage/icon_images'), path.basename(oldGroup?.icon_image_url))
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath)
                    }
                }
                const fileName = `${cuid()}.webp`
                const outputPath = path.join(app.makePath('storage/icon_images'), fileName)

                await sharp(payload.icon_image.tmpPath!)
                    .toFormat('webp', { quality: 80 })
                    .toFile(outputPath)

                iconImageUrl = `/uploads/icon_images/${fileName}`
            } else if (payload.remove_icon) {
                if (oldGroup?.icon_image_url) {
                    const oldPath = path.join(app.makePath('storage/icon_images'), path.basename(oldGroup?.icon_image_url))
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath)
                    }
                    oldGroup.icon_image_url = null
                    await oldGroup.save()
                }
            }

            if (payload.cover_image) {
                if (oldGroup?.cover_image_url) {
                    const oldPath = path.join(app.makePath('storage/cover_images'), path.basename(oldGroup?.cover_image_url))
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath)
                    }
                }
                const fileName = `${cuid()}.webp`
                const outputPath = path.join(app.makePath('storage/cover_images'), fileName)

                await sharp(payload.cover_image.tmpPath!)
                    .toFormat('webp', { quality: 80 })
                    .toFile(outputPath)

                coverImageUrl = `/uploads/cover_images/${fileName}`
            } else if (payload.remove_cover) {
                if (oldGroup?.cover_image_url) {
                    const oldPath = path.join(app.makePath('storage/cover_images'), path.basename(oldGroup?.cover_image_url))
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath)
                    }
                    oldGroup.cover_image_url = null
                    await oldGroup.save()
                }
            }

            const group = await this.chatService.updateGroupChat(oldGroup, { name: payload.name, description: payload.description, icon_image_url: iconImageUrl, cover_image_url: coverImageUrl })

            return ResponseService.send(response, 200, 'Conversa.', { group })
        } catch (err) {
            ResponseService.error(response, err)
        }
    }

    public async addMembers({ response, request, params, auth }: HttpContext) {
        try {
            const currentUser = await auth.authenticateUsing(['api'])
            const chatId = params.chatId || request.input('chatId')
            const ids = request.input('friendsIds') as string[]

            const group = await Chat.query().where('id', chatId).first()

            if (!group) {
                return ResponseService.send(response, 404, 'Grupo não encontrado.')
            }

            if (group.type !== 'g') {
                return ResponseService.send(response, 400, 'Esse chat não é um grupo.')
            }

            const members = await group.related('users').query()
            const existingIds = members.map(u => u.id)
            const newIds = ids.filter((id) => !existingIds.includes(id))

            const data = newIds.reduce<Record<string, { id: string, permission_type: string }>>((acc, userId) => {
                acc[userId] = { id: v4(), permission_type: 'm' }
                return acc
            }, {})

            await group.related('users').attach(data)

            return ResponseService.send(response, 200, 'Membro(s) adicionado(s).', { added: newIds })
        } catch (err) {
            console.log(err)
            ResponseService.error(response, err)
        }
    }

    public async removeMember({ response, request, params, auth }: HttpContext) {
        try {
            const currentUser = await auth.authenticateUsing(['api'])
            const chatId = params.chatId || request.input('chatId')
            const memberId = params.memberId || request.input('memberId')

            const group = await Chat.query().where('id', chatId).first()

            if (!group) {
                return ResponseService.send(response, 404, 'Grupo não encontrado.')
            }

            if (group.type !== 'g') {
                return ResponseService.send(response, 400, 'Esse chat não é um grupo.')
            }

            const admin = await group
                .related('users')
                .query()
                .where('users.id', currentUser.id)
                .andWhere(q => {
                    q.where('user_chats.permission_type', 'a')
                        .orWhere('user_chats.permission_type', 'c')
                })
                .first()

            if (!admin) {
                return ResponseService.send(response, 403, 'Apenas administradores podem remover membros.')
            }

            const member = await group.related('users').query().where('users.id', memberId).first()
            if (!member) {
                return ResponseService.send(response, 404, 'Membro não encontrado no grupo.')
            }

            await group.related('users').detach([memberId])

            return ResponseService.send(response, 200, 'Membro(s) adicionado(s).')
        } catch (err) {
            console.log(err)
            ResponseService.error(response, err)
        }
    }

    public async exit({ response, request, params, auth }: HttpContext) {
        try {
            const currentUser = await auth.authenticateUsing(['api'])
            const chatId = params.chatId || request.input('chatId')

            const group = await Chat.query().where('id', chatId).first()

            if (!group) {
                return ResponseService.send(response, 404, 'Grupo não encontrado.')
            }

            if (group.type !== 'g') {
                return ResponseService.send(response, 400, 'Esse chat não é um grupo.')
            }

            const admin = await group
                .related('users')
                .query()
                .where('user_chats.permission_type', 'a')
                .first()

            if (admin?.id === currentUser.id) {
                const olderCoAdmin = await group
                    .related('users')
                    .query()
                    .where('user_chats.permission_type', 'c')
                    .orderBy('user_chats.created_at', 'asc')
                    .first()

                if (olderCoAdmin) {
                    await group.related('users').pivotQuery()
                        .where('user_id', olderCoAdmin.id)
                        .update({ permission_type: 'a' })
                } else {
                    const olderMember = await group
                        .related('users')
                        .query()
                        .where('user_chats.permission_type', 'm')
                        .orderBy('user_chats.created_at', 'asc')
                        .first()

                    if (olderMember) {
                        await group.related('users').pivotQuery()
                            .where('user_id', olderMember.id)
                            .update({ permission_type: 'a' })
                    }
                }
            }

            const member = await group.related('users').query().where('users.id', currentUser.id).first()
            if (!member) {
                return ResponseService.send(response, 404, 'Membro não encontrado no grupo.')
            }

            await group.related('users').detach([currentUser.id])

            return ResponseService.send(response, 200, 'Saiu do grupo.')
        } catch (err) {
            console.log(err)
            ResponseService.error(response, err)
        }
    }

    public async changePermission({ response, request, params, auth }: HttpContext) {
        try {
            const currentUser = await auth.authenticateUsing(['api'])
            const chatId = params.chatId || request.input('chatId')
            const memberId = params.memberId || request.input('memberId')
            const permissionType = params.permissionType || request.input('permissionType')

            const group = await Chat.query().where('id', chatId).first()
            if (!group) {
                return ResponseService.send(response, 404, 'Grupo não encontrado.')
            }

            if (group.type !== 'g') {
                return ResponseService.send(response, 400, 'Esse chat não é um grupo.')
            }

            const admin = await group
                .related('users')
                .query()
                .where('users.id', currentUser.id)
                .andWhere(q => {
                    q.where('user_chats.permission_type', 'a')
                        .orWhere('user_chats.permission_type', 'c')
                })
                .first()

            if (!admin) {
                return ResponseService.send(response, 403, 'Apenas administradores podem alterar permissões.')
            }

            if (!Object.values(UserChatsPermissionTypes).includes(permissionType)) {
                return ResponseService.send(response, 400, 'Tipo de permissão inválido.')
            }

            await group.related('users').pivotQuery()
                .where('user_id', memberId)
                .update({ permission_type: permissionType })

            return ResponseService.send(response, 200, 'Permissão atualizada com sucesso.')
        } catch (err) {
            console.error(err)
            return ResponseService.error(response, err)
        }
    }
}