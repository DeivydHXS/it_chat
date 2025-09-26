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

router
  .group(() => {
    router.get('/', async () => {
      return { message: 'Welcome to IT Chat API.' }
    })

    router
      .group(() => {
        router
          .post('register', '#controllers/auth_controller.register')
        router
          .post('is_email_not_used', '#controllers/auth_controller.isEmailNotUsed')
        router
          .post('login', '#controllers/auth_controller.login')
        router
          .post('verify_email', '#controllers/auth_controller.verifyEmail')
        router
          .get('get_verification_code', '#controllers/auth_controller.getVerificationCode')
        router
          .post('forgot_password', '#controllers/auth_controller.forgotPassword')
        router
          .post('code_verification', '#controllers/auth_controller.codeVerification')
        router
          .post('change_password', '#controllers/auth_controller.changePassword')
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
          .get('', '#controllers/me_controller.get')
        router
          .post('', '#controllers/me_controller.update')
        router
          .delete('', '#controllers/me_controller.delete')
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

    router
      .group(() => {
        router
          .get('', '#controllers/friends_controller.all')
        router
          .group(() => {
            router
              .post('', '#controllers/friends_controller.send_solicitation')
            router
              .post('accept', '#controllers/friends_controller.accept')
            router
              .post('decline', '#controllers/friends_controller.decline')
            router
              .post('block', '#controllers/friends_controller.block')
            router
              .post('unblock', '#controllers/friends_controller.unblock')
            router
              .delete('unfriend', '#controllers/friends_controller.unfriend')
          })
      }).prefix(':user_id')
      .prefix('friends')
      .use(
        middleware.auth({
          guards: ['api'],
        })
      )

    router
      .group(() => {
        router
          .get('', '#controllers/chats_controller.all')
        router
          .get(':id', '#controllers/chats_controller.get')
      })
      .prefix('chats')
      .use(
        middleware.auth({
          guards: ['api'],
        })
      )

    router
      .group(() => {
        router
          .get('', '#controllers/chats_controller.all')
        router
          .post('', '#controllers/chats_controller.store')
        router
          .group(() => {
            router
              .get('', '#controllers/chats_controller.get')
            router
              .post('', '#controllers/chats_controller.update')
            router
              .delete('', '#controllers/chats_controller.delete')
            router
              .post('add_member', '#controllers/chats_controller.add_member')
          })
          .prefix(':id')
      })
      .prefix('groups')
      .use(
        middleware.auth({
          guards: ['api'],
        })
      )

  })
  .prefix('api')
