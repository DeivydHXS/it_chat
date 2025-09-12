import User from "#models/user";

interface storeInteface {
    name: string;
    nickname: string;
    birthday: string;
    email: string;
    password: string;
}

export default class UserService {
    public async store(data: storeInteface) {
        const user = User.create({...data})
        return user
    }
}