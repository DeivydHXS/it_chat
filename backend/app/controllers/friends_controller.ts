import Friendship, { FriendshipStatus } from '#models/friendship'
import User from '#models/user'
import FriendService from '#services/friend_service'
import ResponseService from '#services/response_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class FriendsController {
    constructor(private friendService: FriendService) { }

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
                console.log('aqui')
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

            const friends = await this.friendService.search(currentUser, search)

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
                    message: 'Erro ao enviar solicitação.',
                    errors: { friendship: 'ID do amigo não informado.' },
                })
            }

            if (currentUser.id as string === friendId) {
                return ResponseService.send(response, 422, 'Usuário de destino inválido.', {
                    friendship: 'Não é possível enviar solicitação de amizade para o próprio usuário.'
                })
            }

            const friendUser = await User.find(friendId)

            if (!friendUser) {
                return ResponseService.send(response, 404, 'Recurso não encontrado.', {
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
                return ResponseService.send(response, 409, 'Já existe uma solicitação de amizade pendente.', {
                    friendship: 'Você já enviou uma solicitação de amizade para este usuário e ela ainda está pendente.'
                })
            }

            await this.friendService.send_solicitation(currentUser, friendId)

            return ResponseService.send(response, 200, 'Solicitação enviada com sucesso!')
            // return ResponseService.send(response, 200, 'Solicitação enviada com sucesso!', {
            //     friends: await currentUser.related('friendships').pivotQuery(),
            // })
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
                return ResponseService.send(response, 404, 'Solicitação de amizade não encontrada.', {
                    friendship: 'Não existe solicitação de amizade pendente para este usuário.'
                })
            }

            if (friendship.status === FriendshipStatus.Accepted) {
                return ResponseService.send(response, 422, 'O relacionamento de amizade já está ativo.', {
                    friendship: 'A solicitação de amizade já foi aceita.'
                })
            }

            if (friendship.send_to !== currentUser.id as string) {
                return ResponseService.send(response, 403, 'Acesso negado. Você não tem autorização para realizar esta ação.', {
                    friendship: 'Você não é o destinatário desta solicitação de amizade.'
                })
            }

            await this.friendService.accept(friendship)

            return ResponseService.send(response, 200, 'Solicitação aceita com sucesso.')
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
                return ResponseService.error(response, {
                    message: 'Erro ao recusar solicitação.',
                    errors: { friendship: 'Solicitação não encontrada.' },
                })
            }

            if (friendship.send_to !== currentUser.id as string) {
                return ResponseService.error(response, {
                    message: 'Erro ao recusar solicitação.',
                    errors: { friendship: 'Você não tem permissão para recusar esta solicitação.' },
                })
            }

            await this.friendService.refuse(friendship)

            return ResponseService.send(response, 200, 'Solicitação recusada com sucesso.')
        } catch (error) {
            return ResponseService.error(response, error)
        }
    }

    public async block({ auth, response, params }: HttpContext) {
        try {
            const currentUser = await auth.authenticate()
            const userId = params.user_id

            if (!userId) {
                return ResponseService.error(response, {
                    message: 'Erro ao bloquear usuário.',
                    errors: { friendship: 'ID do usuário não informado.' },
                })
            }

            const userToBlock = await User.find(userId)
            if (!userToBlock) {
                return ResponseService.error(response, {
                    message: 'Erro ao bloquear usuário.',
                    errors: { friendship: 'Usuário não encontrado.' },
                })
            }

            const existing = await Friendship.query()
                .where((q) => {
                    q.where('send_by', currentUser.id as string).andWhere('send_to', userId)
                })
                .orWhere((q) => {
                    q.where('send_by', userId).andWhere('send_to', currentUser.id as string)
                })
                .first()

            if (!existing) {
                return ResponseService.error(response, {
                    message: 'Erro ao bloquear usuário.',
                    errors: { friendship: 'Registro de amizade não encontrada.' },
                })
            }

            this.friendService.block(existing)

            return ResponseService.send(response, 200, 'Usuário bloqueado com sucesso.')
        } catch (error) {
            return ResponseService.error(response, error)
        }
    }

    public async unblock({ auth, response, params }: HttpContext) {
        try {
            const currentUser = await auth.authenticate()
            const userId = params.user_id

            const friendship = await Friendship.query()
                .where((q) => {
                    q.where('send_by', currentUser.id as string).andWhere('send_to', userId)
                })
                .orWhere((q) => {
                    q.where('send_by', userId).andWhere('send_to', currentUser.id as string)
                })
                .first()

            if (!friendship) {
                return ResponseService.error(response, {
                    message: 'Erro ao desbloquear usuário.',
                    errors: { friendship: 'Amizade não encontrada.' },
                })
            }

            if (friendship.status !== FriendshipStatus.Blocked) {
                return ResponseService.error(response, {
                    message: 'O usuário não está bloqueado.',
                    errors: { friendship: 'Este usuário não consta na sua lista de bloqueios para ser desbloqueado.' },
                })
            }

            this.friendService.accept(friendship)

            return ResponseService.send(response, 200, 'Amizade desbloqueada com sucesso!')
        } catch (error) {
            return ResponseService.error(response, error)
        }
    }

    public async unfriend({ auth, response, params }: HttpContext) {
        try {
            const currentUser = await auth.authenticate()
            const userId = params.user_id

            const friendship = await Friendship.query()
                .where((q) => {
                    q.where('send_by', currentUser.id as string).andWhere('send_to', userId)
                })
                .orWhere((q) => {
                    q.where('send_by', userId).andWhere('send_to', currentUser.id as string)
                })
                .first()

            if (!friendship) {
                return ResponseService.error(response, {
                    message: 'Recurso não encontrado.',
                    errors: { friendship: 'Não existe um registro de amizade ativa com este usuário. A amizade já foi excluída.' },
                })
            }

            this.friendService.unfriend(friendship)

            return ResponseService.send(response, 200, 'Amizade excluida com sucesso!')
        } catch (error) {
            return ResponseService.error(response, error)
        }
    }
}
