/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.group(() => {
  router.get('/', async () => {
    return { message: 'Welcome to IT Chat API.' }
  })

  router.get('me', '#controllers/auth_controller.me')

  router.group(() => {
    router.post('register', '#controllers/auth_controller.register')
    router.post('login', '#controllers/auth_controller.login')
    router.post('logout', '#controllers/auth_controller.logout')
      .use(
        middleware.auth({
          guards: ['api'],
        })
      )
  }).prefix('auth')

  router.group(() => {
    router.post(':id', '#controllers/users_controller.get')
  }).prefix('users')
}).prefix('api')
