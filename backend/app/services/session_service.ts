import User from "#models/user";
import { Authenticator } from "@adonisjs/auth";
import { Authenticators } from "@adonisjs/auth/types";
import hash from "@adonisjs/core/services/hash";
import { TransactionClientContract } from "@adonisjs/lucid/types/database";

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
            token = { access_token: hash.fake() }
        } else {
            user = await User.verifyCredentials(email, password)
            token = await auth.use('api').createToken(user)
        }

        return { user: user.toJSON(), token }
    }

    async destroy(auth: any) {
        await auth.use('api').invalidateToken()
    }

}