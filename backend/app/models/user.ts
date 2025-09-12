import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, beforeCreate, column, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Chat from './chat.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { v4, type UUIDTypes } from 'uuid'
import { randomBytes } from 'crypto'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  public static addId(user: User) {
    user.id = v4()
  }

  @beforeCreate()
  public static addNicknameHash(user: User) {
    user.nickname_hash = randomBytes(2).toString('hex');
  }

  @column({ isPrimary: true })
  declare id: UUIDTypes

  @column()
  declare name: string

  @column()
  declare email: string

  @column()
  declare nickname: string

  @column()
  declare nickname_hash: string

  @column()
  declare birthday: string

  @column()
  declare bio: string | null

  @column()
  declare profile_image_url: string | null

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '1 day',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })

  @manyToMany(() => User, {
    pivotTable: 'friendships',
  })
  declare friendships: ManyToMany<typeof User>

  @manyToMany(() => Chat)
  declare chats: ManyToMany<typeof Chat>
}