import User from '#models/user'
import Friendship, { FriendshipStatus } from '#models/friendship'
import Chat from '#models/chat'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { v4 as uuidv4 } from 'uuid'

export default class extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        name: 'Test User',
        nickname: 'SuperQA',
        email: 'superqa@email.com',
        password: 'SuperQA1@',
        birthday: '2000-08-21',
        status: 'a',
      },
      {
        name: 'Dev User',
        nickname: 'SuperDEV',
        email: 'superdev@email.com',
        password: 'SuperDEV1@',
        birthday: '2002-08-18',
        status: 'a',
      },
    ])

    const usersData = [
      { name: 'Alice', nickname: 'alice', email: 'alice@email.com' },
      { name: 'Bob', nickname: 'bob', email: 'bob@email.com' },
      { name: 'Carol', nickname: 'carol', email: 'carol@email.com' },
      { name: 'Dave', nickname: 'dave', email: 'dave@email.com' },
      { name: 'Eve', nickname: 'eve', email: 'eve@email.com' },
    ].map((u) => ({
      ...u,
      password: 'Password123!',
      birthday: '2000-01-01',
      status: 'a',
    }))

    const users = await User.createMany(usersData)

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

    console.log('✅ Seeder finalizado: 5 usuários, amizades e chats privados criados')
  }
}
