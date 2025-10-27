import Chat from '#models/chat'
import Friendship from '#models/friendship'
import User from '#models/user'
import { v4 } from 'uuid'

export default class ChatService {
  public async get(id: string) {
    const chat = await Chat.query()
      .where('id', id)
      .preload('users')
      .preload('messages', (q) => {
        q.orderBy('created_at', 'asc')
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

    const result = {
      ...chat.serialize(),
      blocker_id: friendship?.blocker_id
    }

    return result
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

  public async createGroupChat(ownerId: string, name: string, description?: string) {
    const group = await Chat.create({
      name,
      type: 'g',
      description: description || null,
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
