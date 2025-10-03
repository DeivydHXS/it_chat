import Friendship from '#models/friendship'
import User from '#models/user'
import ResponseService from '#services/response_service'
import UserService from '#services/user_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { v4 } from 'uuid'

@inject()
export default class FriendsController {
    constructor(
        private userService: UserService
    ) { }

    public async search({ response, request, auth }: HttpContext) {
        try {
            const search = request.input('search')
            const user = await auth.authenticateUsing(['api'])

            const friends = await this.userService.friendsSearch(user, search)
            ResponseService.send(response, 200, 'Busca de usuário.', { friends })
        } catch (err) {
            ResponseService.error(response, err)
        }
    }

    public async send_solicitation({ auth, response, params }: HttpContext) {
        try {
            const currentUser = await auth.authenticate()
            const friendId = params.user_id
            console.log(currentUser.id)
            console.log(friendId)
            if (currentUser.id === friendId) {
                return ResponseService.error(response, {
                    message: 'Erro ao enviar solicitação.', errors: {
                        friendship: 'Você não pode enviar solicitação para si mesmo.'
                    }
                })
            }

            const existing = await db
                .from('friendships')
                .where(function (query) {
                    query.where('send_by', currentUser.id).andWhere('send_to', friendId)
                })
                .orWhere(function (query) {
                    query.where('send_by', friendId).andWhere('send_to', currentUser.id)
                })
                .first()

            if (existing) {
                return ResponseService.error(response, {
                    message: 'Erro ao enviar solicitação.', errors: {
                        friendship: 'Já existe uma solicitação ou amizade entre vocês.'
                    }
                })
            }

            await currentUser.related('friendships').attach({
                [friendId]: {
                    id: v4(),
                    status: 'p'
                }
            })

            return ResponseService.send(response, 200, 'Solicitação enviada com sucesso.')
        } catch (error) {
            return ResponseService.error(response, error)
        }
    }


    public async accept({ auth, response, params }: HttpContext) {
        try {
            const currentUser = await auth.authenticate()
            const friendshipId = params.friendship_id

            // const solicitation = await db.from('friendships').where('id', friendshipId).andWhere('send_to', currentUser.id as string)
            const solicitation = await Friendship.findBy('id', friendshipId)

            if (!solicitation) {
                return
            }

            if (solicitation.send_to !== currentUser.id) {
                return
            }

            solicitation.status = 'a'
            await solicitation.save()
            
            return ResponseService.send(response, 200, 'Solicitação aceita com sucesso.')
        } catch (error) {
            return ResponseService.error(response, error)
        }
    }


    public async decline({ response, params }: HttpContext) {
        const id = params.user_id

        ResponseService.send(response, 200, 'Sucesso.')
    }

    public async block({ response, params }: HttpContext) {
        const id = params.user_id

        ResponseService.send(response, 200, 'Sucesso.')
    }

    public async unblock({ response, params }: HttpContext) {
        const id = params.user_id

        ResponseService.send(response, 200, 'Sucesso.')
    }

    public async unfriend({ response, params }: HttpContext) {
        const id = params.user_id

        ResponseService.send(response, 200, 'Sucesso.')
    }
}