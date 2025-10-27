import User from '#models/user'
import Friendship, { FriendshipStatus } from '#models/friendship'
import Chat from '#models/chat'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { v4 as uuidv4 } from 'uuid'

export default class extends BaseSeeder {
  public async run() {
    const usersData = [
      {
        name: 'Davi',
        nickname: 'davi',
        email: 'davi@email.com',
        password: 'Senha123@',
        birthday: '2000-01-01',
      },
      {
        name: 'Deivyd',
        nickname: 'deivyd',
        email: 'deivyd@email.com',
        password: 'Senha123@',
        birthday: '2000-01-01',
      },
      {
        name: 'Diego',
        nickname: 'diego',
        email: 'diego@email.com',
        password: 'Senha123@',
        birthday: '2000-01-01',
      },
      {
        name: 'Edu',
        nickname: 'edu',
        email: 'edu@email.com',
        password: 'Senha123@',
        birthday: '2000-01-01',
      },
      {
        name: 'Maikon',
        nickname: 'maikon',
        email: 'maikon@email.com',
        password: 'Senha123@',
        birthday: '2000-01-01',
      },
      {
        name: 'Pamela',
        nickname: 'pam',
        email: 'pam@email.com',
        password: 'Senha123@', birthday: '2000-01-01',
      },
    ]

    const users = await User.createMany(usersData)
    for (let i = 0; i < users.length; i++) {
      users[i].status = 'a'
      await users[i].save()
    }

    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        await Friendship.create({
          id: uuidv4(),
          send_by: users[i].id,
          send_to: users[j].id,
          status: FriendshipStatus.Accepted,
        })
      }
    }

    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        const chat = await Chat.create({
          id: uuidv4(),
          name: null,
          type: 'p',
        })

        await users[i].related('chats').attach({
          [chat.id]: { id: uuidv4(), permission_type: 'm' },
        })

        await users[j].related('chats').attach({
          [chat.id]: { id: uuidv4(), permission_type: 'm' },
        })
      }
    }
  }
}
