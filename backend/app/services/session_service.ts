import User from "#models/user";
import { Authenticator } from "@adonisjs/auth";
import { Authenticators } from "@adonisjs/auth/types";
import hash from "@adonisjs/core/services/hash";
import { TransactionClientContract } from "@adonisjs/lucid/types/database";
import UserService from "./user_service.js";

interface storeInteface {
    email: string;
    password: string;
}

export default class SessionService {
    public async store({ email, password }: storeInteface, auth: Authenticator<Authenticators>, trx?: TransactionClientContract) {
        let user
        let token

        if (trx) {
            user = await User.query({ client: trx }).where('email', email).firstOrFail()

            const isValid = await hash.verify(user.password, password)
            if (!isValid) {
                throw new Error('Credenciais inválidas.')
            }
            token = {
                value: hash.fake(),
                expiresAt: Date.now(),
                createdAt: Date.now()
            }
        } else {
            user = await User.verifyCredentials(email, password)
            token = await auth.use('api').createToken(user)
        }

        return {
            user: UserService.formatUserResponse(user),
            token: {
                access_token: token.value!.release() ?? token.value,
                expires_at: token.expiresAt,
                created_at: token.createdAt
            }
        }
    }

    async destroy(auth: any) {
        await auth.use('api').invalidateToken()
    }

}