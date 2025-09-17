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

  router
    .group(() => {
      router
        .post('register', '#controllers/auth_controller.register')
      router
        .post('login', '#controllers/auth_controller.login')
      router
        .post('verify_email', '#controllers/auth_controller.verify_email')
      router
        .post('forgot_password', '#controllers/auth_controller.forgot_password')
      router
        .post('code_verification', '#controllers/auth_controller.code_verification')
      router
        .post('change_password', '#controllers/auth_controller.change_password')
      router
        .post('logout', '#controllers/auth_controller.logout')
        .use(
          middleware.auth({
            guards: ['api'],
          })
        )
    })
    .prefix('auth')

  router
    .group(() => {
      router
        .get('', '#controllers/me_controller.get_profile')
      router
        .post('', '#controllers/me_controller.update_profile')
      router
        .delete('', '#controllers/me_controller.delete_account')
    })
    .prefix('me')
    .use(
      middleware.auth({
        guards: ['api'],
      })
    )

  router
    .group(() => {
      router.get('', '#controllers/users_controller.all')
      router.get(':id', '#controllers/users_controller.get')
    })
    .prefix('users')
    .use(
      middleware.auth({
        guards: ['api'],
      })
    )
    
}).prefix('api')
