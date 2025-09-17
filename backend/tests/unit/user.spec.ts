import { test } from '@japa/runner'

import hash from '@adonisjs/core/services/hash'
import UserService from '#services/user_service'
import db from '@adonisjs/lucid/services/db'

test.group('creating user', (group) => {
  let trx: any

  group.setup(async () => {
    trx = await db.transaction()
  })

  group.teardown(async () => {
    await trx.rollback()
  })

  test('hashes user password', async ({ assert }) => {
    const password = 'Senha123@'

    const userService = new UserService()
    const user = await userService.store({
      name: 'Test',
      nickname: 'test',
      birthday: '2000-01-01',
      email: 'test@email.com',
      password: password,
    }, trx)

    assert.isTrue(hash.isValidHash(user.password))
    assert.isTrue(await hash.verify(user.password, password))
  })
})