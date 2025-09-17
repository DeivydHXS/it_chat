import { test } from '@japa/runner'

import hash from '@adonisjs/core/services/hash'
import UserService from '#services/user_service'
import db from '@adonisjs/lucid/services/db'

test.group('registering_user', (group) => {
  let trx: any
  const userService = new UserService()

  group.setup(async () => {
    trx = await db.transaction()
  })

  group.teardown(async () => {
    await trx.rollback()
  })

  test('valid_user', async ({ assert }) => {
    const user = await userService.store({
      name: 'Test',
      nickname: 'test',
      birthday: '2000-01-01',
      email: `test${Date.now()}@email.com`,
      password: 'Senha123@',
    }, trx)

    assert.isNotEmpty(user.id)
  })

  test('duplicate_email', async ({ assert }) => {
    const email = `test${Date.now()}@email.com`
    const user = await userService.store({
      name: 'Test',
      nickname: 'test',
      birthday: '2000-01-01',
      email,
      password: 'Senha123@',
    }, trx)

    assert.rejects(async () => {
      const user = await userService.store({
        name: 'Test',
        nickname: 'test',
        birthday: '2000-01-01',
        email,
        password: 'Senha123@',
      }, trx)
    })
  })

  test('hashes_password', async ({ assert }) => {
    const password = 'Senha123@'

    const user = await userService.store({
      name: 'Test',
      nickname: 'test',
      birthday: '2000-01-01',
      email: `test${Date.now()}@email.com`,
      password: password,
    }, trx)

    assert.isTrue(hash.isValidHash(user.password))
    assert.isTrue(await hash.verify(user.password, password))
  })
  

  test('update_user', async ({ assert }) => {

  })
})