import User from "#models/user";
import { Authenticator } from "@adonisjs/auth";
import { Authenticators } from "@adonisjs/auth/types";

interface storeInteface {
    email: string;
    password: string;
}

export default class SessionService {
    public async store({ email, password }: storeInteface, auth: Authenticator<Authenticators>) {
        const user = await User.verifyCredentials(email, password)
        const token = await auth.use('api').createToken(user)
        return { user, token }
    }
    async destroy(auth: any) {
        await auth.use('api').invalidateToken()
    }

}