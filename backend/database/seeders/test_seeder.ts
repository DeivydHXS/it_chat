import User from '#models/user'
import Friendship, { FriendshipStatus } from '#models/friendship'
import Chat from '#models/chat'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { v4 as uuidv4 } from 'uuid'

export default class extends BaseSeeder {
  public async run() {
    const usersData = [
      {
        name: 'Teste',
        nickname: 'teste',
        email: 'teste@email.com',
        password: 'Senha123@',
        birthday: '2000-01-01',
      },
      {
        name: 'Outro',
        nickname: 'outro',
        email: 'outro@email.com',
        password: 'Senha123@', birthday: '2000-01-01',
      },
    ]

    await User.createMany(usersData)
  }
}
