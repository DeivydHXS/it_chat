import User from "#models/user";
import mail from '@adonisjs/mail/services/main'

interface storeInteface {
    name: string;
    nickname: string;
    birthday: string;
    email: string;
    password: string;
}

export default class UserService {
    public async store(data: storeInteface) {
        const user = await User.create({ ...data })

        // Enviar email com código de validação de conta
        // Comentado para não ficar enviando email durante os testes
        // await mail.send((message) => {
        //     message
        //         .to(user.email)
        //         .subject('Código de verificação')
        //         .text('Aqui vai aparecer o código de verificação do usuário que ele vai copiar e colar no app para validar sua conta.')
        // })

        return user
    }
}