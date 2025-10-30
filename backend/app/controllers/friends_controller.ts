import Chat from '#models/chat'
import Friendship, { FriendshipStatus } from '#models/friendship'
import User from '#models/user'
import ChatService from '#services/chat_service'
import FriendService from '#services/friend_service'
import ResponseService from '#services/response_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { v4 } from 'uuid'

@inject()
export default class FriendsController {
    constructor(
        private friendService: FriendService,
        private chatService: ChatService
    ) { }

    public async getSolicitationId({ response, request, params, auth }: HttpContext) {
        try {
            const currentUser = await auth.authenticateUsing(['api'])
            const friendId = params.friendship_id || request.input('friendship_id')

            const friendship = await Friendship.query()
                .where((query) => {
                    query.where('send_by', currentUser.id as string).andWhere('send_to', friendId)
                })
                .orWhere((query) => {
                    query.where('send_by', friendId).andWhere('send_to', currentUser.id as string)
                }).first()

            if (!friendship) {
                return ResponseService.error(response, {
                    message: 'Erro ao encontrar solicitação.',
                    errors: { friendship: 'Solicitação não encontrada.' },
                })
            }

            return ResponseService.send(response, 200, 'Solicitação encontrada!', { friendship })
        } catch (err) {
            ResponseService.error(response, err)
        }
    }

    public async search({ response, request, auth }: HttpContext) {
        try {
            const currentUser = await auth.authenticateUsing(['api'])
            const search = request.input('search')
            const tab = request.input('tab')

            var options = {}

            if (tab === 'friends') {
                options = {
                    search,
                    status: 'a'
                }
            }

            if (tab === 'requests') {
                options = {
                    search,
                    status: 'p'
                }
            }

            const friends = await this.friendService.list(currentUser, options)
            console.log(tab, friends)
            ResponseService.send(response, 200, 'Busca de usuário.', { friends })
        } catch (err) {
            ResponseService.error(response, err)
        }
    }

    public async sendSolicitation({ auth, response, request, params }: HttpContext) {
        try {
            const currentUser = await auth.authenticate()
            const friendId = params.friendship_id || request.input('friendship_id')

            if (!friendId) {
                return ResponseService.error(response, {
                    message: 'Requisição inválida.',
                    errors: { friendship: 'ID do amigo não informado.' },
                })
            }

            if (currentUser.id as string === friendId) {
                return ResponseService.send(response, 422, 'Requisição inválida.', {
                    friendship: 'Não é possível enviar solicitação de amizade para o próprio usuário.'
                })
            }

            const friendUser = await User.find(friendId)

            if (!friendUser) {
                return ResponseService.send(response, 404, 'Requisição inválida.', {
                    friendship: 'O perfil do usuário que você tentou acessar não foi encontrado.'
                })
            }

            const friendship = await Friendship.query()
                .where((query) => {
                    query.where('send_by', currentUser.id as string).andWhere('send_to', friendId)
                })
                .orWhere((query) => {
                    query.where('send_by', friendId).andWhere('send_to', currentUser.id as string)
                }).first()

            if (friendship) {
                return ResponseService.send(response, 409, 'Requisição inválida.', {
                    friendship: 'Você já enviou uma solicitação de amizade para este usuário e ela ainda está pendente.'
                })
            }

            await this.friendService.send_solicitation(currentUser, friendId)

            return ResponseService.send(response, 200, 'Solicitação enviada com sucesso!')
        } catch (error) {
            return ResponseService.error(response, error)
        }
    }

    public async accept({ auth, response, params }: HttpContext) {
        try {
            const currentUser = await auth.authenticate()
            const friendshipId = params.friendship_id

            const friendship = await Friendship.find(friendshipId)

            if (!friendship) {
                return ResponseService.send(response, 404, 'Requisição inválida.', {
                    friendship: 'Não existe solicitação de amizade pendente para este usuário.'
                })
            }

            if (friendship.send_to !== currentUser.id as string) {
                return ResponseService.send(response, 403, 'Requisição inválida.', {
                    friendship: 'Você não é o destinatário desta solicitação de amizade.'
                })
            }

            if (friendship.status === FriendshipStatus.Accepted) {
                return ResponseService.send(response, 422, 'Requisição inválida.', {
                    friendship: 'A solicitação de amizade já foi aceita.'
                })
            }

            await this.friendService.accept(friendship)

            const friendshipChat = await Chat.create({ type: 'p' })

            const friend = await User.find(friendship.send_by)

            if (friend) {
                await currentUser.related('chats').attach({
                    [friendshipChat.id]: { id: v4(), permission_type: 'm' }
                })

                await friend.related('chats').attach({
                    [friendshipChat.id]: { id: v4(), permission_type: 'm' }
                })
            }

            return ResponseService.send(response, 200, 'Solicitação de amizade aceita com sucesso!', {
                friendship
            })
        } catch (error) {
            return ResponseService.error(response, error)
        }
    }

    public async decline({ auth, response, params }: HttpContext) {
        try {
            const currentUser = await auth.authenticate()
            const friendshipId = params.friendship_id

            const friendship = await Friendship.find(friendshipId)

            if (!friendship) {
                return ResponseService.send(response, 404, 'Requisição inválida.', {
                    friendship: 'Não existe solicitação de amizade pendente para este usuário.'
                })
            }

            if (friendship.send_to !== currentUser.id as string) {
                return ResponseService.error(response, {
                    message: 'Requisição inválida.',
                    errors: { friendship: 'Você não tem permissão para recusar esta solicitação.' },
                })
            }

            if (friendship.status === FriendshipStatus.Refused) {
                return ResponseService.send(response, 422, 'Requisição inválida.', {
                    friendship: 'A solicitação de amizade com este usuário já foi recusada.'
                })
            }

            await this.friendService.refuse(friendship)

            return ResponseService.send(response, 200, 'Amizade recusada com sucesso!')
        } catch (error) {
            return ResponseService.error(response, error)
        }
    }

    public async block({ auth, response, params }: HttpContext) {
        try {
            const currentUser = await auth.authenticate()
            const friendshipId = params.friendship_id

            const friendship = await Friendship.find(friendshipId)

            if (!friendship) {
                return ResponseService.send(response, 404, 'Requisição inválida.', {
                    friendship: 'Amizade não encontrada.'
                })
            }

            if (friendship.status === FriendshipStatus.Blocked) {
                return ResponseService.send(response, 422, 'Requisição inválida.', {
                    friendship: 'Você já bloqueou este usuário.'
                })
            }

            this.friendService.block(friendship, currentUser.id)

            return ResponseService.send(response, 200, 'Amizade bloqueada com sucesso!')
        } catch (error) {
            return ResponseService.error(response, error)
        }
    }

    public async unblock({ auth, response, params }: HttpContext) {
        try {
            const currentUser = await auth.authenticate()
            const friendshipId = params.friendship_id

            const friendship = await Friendship.find(friendshipId)

            if (!friendship) {
                return ResponseService.send(response, 404, 'Requisição inválida.', {
                    friendship: 'Amizade não encontrada.'
                })
            }

            if (friendship.status !== FriendshipStatus.Blocked) {
                return ResponseService.send(response, 422, 'Requisição inválida.', {
                    friendship: 'Este usuário não consta na sua lista de bloqueios para ser desbloqueado.'
                })
            }

            if (friendship.blocker_id !== currentUser.id) {
                return ResponseService.error(response, {
                    message: 'Requisição inválida.',
                    errors: { friendship: 'Você não tem permissão para desbloquear esta amizade.' },
                })
            }

            this.friendService.unblock(friendship)

            return ResponseService.send(response, 200, 'Amizade desbloqueada com sucesso!')
        } catch (error) {
            return ResponseService.error(response, error)
        }
    }

    public async unfriend({ auth, response, params }: HttpContext) {
        try {
            const currentUser = await auth.authenticate()
            const friendshipId = params.friendship_id

            const friendship = await Friendship.find(friendshipId)

            if (!friendship) {
                return ResponseService.send(response, 422, 'Requisição inválida.', {
                    friendship: 'Não existe um registro de amizade ativa com este usuário. A amizade já foi excluída.'
                })
            }

            this.friendService.unfriend(friendship)

            return ResponseService.send(response, 200, 'Amizade excluida com sucesso!')
        } catch (error) {
            return ResponseService.error(response, error)
        }
    }
}
