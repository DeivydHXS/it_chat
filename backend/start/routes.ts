/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

// const AuthController = () => import('#controllers/auth_controller')

router.group(() => {
  router.get('/', async () => {
    return { message: 'Welcome to IT Chat API.' }
  })

  router.group(() => {
    router.post('register', '#controllers/auth_controller.register')
    router.post('login', '#controllers/auth_controller.login')
    router.post('logout', '#controllers/auth_controller.logout')
  }).prefix('auth')
}).prefix('api')
