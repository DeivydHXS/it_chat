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
          .post('is_birthday_valid', '#controllers/auth_controller.isBirthdayValid')
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
          .post('change_password', '#controllers/me_controller.changePassword')
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
        router.get('', '#controllers/users_controller.search')
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
          .get('', '#controllers/friends_controller.search')
        router
          .get('accepted', '#controllers/friends_controller.accepted')
        router
          .get('pending', '#controllers/friends_controller.pending')
        router
          .group(() => {
            router
              .get('get_solicitation_id', '#controllers/friends_controller.getSolicitationId')
            router
              .post('', '#controllers/friends_controller.sendSolicitation')
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
          }).prefix(':friendship_id')
      }).prefix('friends')
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
          .get(':chatId', '#controllers/chats_controller.get')
      })
      .prefix('chats')
      .use(
        middleware.auth({
          guards: ['api'],
        })
      )

    router
      .group(() => {
        router.get('', '#controllers/messages_controller.index')
        router.post(':chatId', '#controllers/messages_controller.store')
        router.delete(':messageId', '#controllers/messages_controller.delete')
      }).prefix('messages')
      .use(
        middleware.auth({
          guards: ['api'],
        })
      )

    router
      .group(() => {
        router
          .get('', '#controllers/chats_controller.allGroups')
        router
          .post('', '#controllers/chats_controller.store')
        router
          .group(() => {
            router
              .get('', '#controllers/chats_controller.getGroup')
            router
              .post('', '#controllers/chats_controller.update')
            router
              .delete('', '#controllers/chats_controller.delete')
            router
              .post('add-members', '#controllers/chats_controller.addMembers')
            router
              .post('change-permission', '#controllers/chats_controller.changePermission')
            router
              .post('remove-member', '#controllers/chats_controller.removeMember')
            router
              .post('exit', '#controllers/chats_controller.exit')
          })
          .prefix(':chatId')
      })
      .prefix('groups')
      .use(
        middleware.auth({
          guards: ['api'],
        })
      )

  })
  .prefix('api')
