import Chat from '#models/chat'
import Friendship from '#models/friendship'
import User from '#models/user'
import UserChats from '#models/user_chats'
import db from '@adonisjs/lucid/services/db'
import { v4 } from 'uuid'

export default class ChatService {
  public async get(id: string) {
    const chat = await Chat.query()
      .where('id', id)
      .preload('users')
      .preload('messages', (q) => {
        q.preload('user')
          .orderBy('created_at', 'asc')
      })
      .first()

    if (!chat) {
      throw new Error('Chat não encontrado')
    }

    const user1 = chat?.users[0].id
    const user2 = chat?.users[1].id

    const friendship = await Friendship.query()
      .where(query => {
        query.where('send_to', user2 as string).andWhere('send_by', user1 as string)
      })
      .orWhere(query => {
        query.where('send_to', user1 as string).andWhere('send_by', user2 as string)
      })
      .first()

    var is_active: boolean = true

    if (!friendship) {
      is_active = false
    }

    if (friendship?.blocker_id) {
      is_active = false
    }

    const result = {
      ...chat.serialize(),
      blocker_id: friendship?.blocker_id,
      friendship_id: friendship?.id,
      is_active,
    }

    return result
  }

  public async getGroup(id: string) {
    const chat = await Chat.query()
      .where('id', id)
      .preload('users')
      .preload('messages', (q) => {
        q.preload('user')
          .orderBy('created_at', 'asc')
      })
      .first()

    if (!chat) {
      throw new Error('Chat não encontrado')
    }

    const admins = await db
      .from('user_chats')
      .where('chat_id', chat.id)
      .where('permission_type', 'a')

    return {
      ...chat.serialize(),
      admins,
      is_active: true
    } as Chat & {
      admins: UserChats[],
      is_active: boolean
    }
  }

  public async createPrivateChat(user1Id: string, user2Id: string) {
    const existingChat = await Chat.query()
      .where('type', 'p')
      .whereHas('users', (q) => q.where('users.id', user1Id))
      .whereHas('users', (q) => q.where('users.id', user2Id))
      .preload('users')
      .first()

    if (existingChat) {
      return existingChat
    }

    const chat = await Chat.create({ type: 'p' })
    await chat.related('users').attach([user1Id, user2Id])

    return chat
  }

  public async createGroupChat(
    ownerId: string,
    payload: Partial<Chat>) {
    const group = await Chat.create({
      ...payload,
      type: 'g',
    })

    await group.related('users').attach({
      [ownerId]: {
        id: v4(),
        permission_type: 'a'
      }
    })
    // await group.load('users')

    return group
  }

  public async listForUser(userId: string) {
    const user = await User.findOrFail(userId)
    await user.load('chats', (query) => query.preload('users'))
    return user.chats
  }
}
