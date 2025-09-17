import User from "#models/user";
import { TransactionClientContract } from "@adonisjs/lucid/types/database";
import mail from '@adonisjs/mail/services/main'

export default class UserService {
    public async store(payload: Partial<User>, trx?: TransactionClientContract) {
        const user = await User.create(payload, { client: trx })

        // Enviar email com código de validação de conta
        // Comentado para não ficar enviando email durante os testes
        if (!trx) {
            await mail.send((message) => {
                message
                    .to(user.email)
                    .subject('Código de verificação')
                    .text('Aqui vai aparecer o código de verificação do usuário que ele vai copiar e colar no app para validar sua conta.')
            })
        }

        return user
    }

    public async update(user_id: string, payload: Partial<User>, trx?: TransactionClientContract) {
        const user = await User.findOrFail(user_id, { client: trx })
        user.merge(payload)
        await user.save()
        return user
    }
}