import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
    public async register(context: HttpContext) {
        return { message: 'register' }
    }
}