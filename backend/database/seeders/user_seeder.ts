import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
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
  }
}