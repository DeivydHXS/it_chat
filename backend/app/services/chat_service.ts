import Chat from '#models/chat'
import User from '#models/user'

export default class ChatService {
  public async get(id: string) {
    const chat = await Chat.query()
      .where('id', id)
    //   .preload('users')
      .preload('messages', (q) => {
        q.orderBy('created_at', 'asc')
      })
      .first()

    if (!chat) {
      throw new Error('Chat não encontrado')
    }

    return chat
  }

  public async createPrivateChat(user1Id: string, user2Id: string) {
    const existingChat = await Chat.query()
      .where('type', 'p') // "p" = private
      .whereHas('users', (q) => q.where('users.id', user1Id))
      .whereHas('users', (q) => q.where('users.id', user2Id))
      .preload('users')
      .first()

    if (existingChat) {
      return existingChat
    }

    const chat = await Chat.create({ type: 'p' })
    await chat.related('users').attach([user1Id, user2Id])
    await chat.load('users')

    return chat
  }

  public async createGroupChat(userIds: string[], name: string, description?: string) {
    const chat = await Chat.create({
      type: 'g',
      name,
      description: description || null,
    })

    await chat.related('users').attach(userIds)
    await chat.load('users')

    return chat
  }

  public async listForUser(userId: string) {
    const user = await User.findOrFail(userId)
    await user.load('chats', (query) => query.preload('users'))
    return user.chats
  }
}
