import User from "#models/user";
import { Authenticator } from "@adonisjs/auth";
import { Authenticators } from "@adonisjs/auth/types";

interface storeInteface {
    email: string;
    password: string;
}

export default class SessionService {
    public async store(data: storeInteface, auth: Authenticator<Authenticators>) {
        const user = await User.verifyCredentials(data.email, data.password)
        const token = await auth.use('api').createToken(user)
        return { user, token }
    }
}