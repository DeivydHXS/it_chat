import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, beforeCreate, column, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Chat from './chat.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { v4 } from 'uuid'
import { randomBytes } from 'crypto'
import Friendship from './friendship.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  public static assignId(user: User) {
    user.id = v4()
  }

  @beforeCreate()
  public static addNicknameHash(user: User) {
    user.nickname_hash = randomBytes(2).toString('hex').toUpperCase();
  }

  @beforeCreate()
  public static setStatusPending(user: User) {
    user.status = 'p';
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column({ serializeAs: null })
  declare email: string

  @column()
  declare nickname: string

  @column({ serializeAs: 'nickname_hash' })
  declare nickname_hash: string

  @column()
  declare birthday: string

  @column({ serializeAs: 'bio' })
  declare bio: string | null

  @column({ serializeAs: 'profile_image_url' })
  declare profile_image_url: string | null

  @column({ serializeAs: null })
  declare password: string

  @column({ serializeAs: null })
  declare verification_code: number | null

  @column({ serializeAs: null })
  declare status: string

  @column.dateTime({ serializeAs: 'created_at', autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ serializeAs: 'updated_at', autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30d',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })

  @manyToMany(() => User, {
    pivotTable: 'friendships',
    localKey: 'id',
    pivotForeignKey: 'send_by',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'send_to',
  })
  declare friendships: ManyToMany<typeof User>

  @manyToMany(() => Chat, {
    pivotTable: 'user_chats',
    pivotColumns: ['permission_type', 'created_at', 'updated_at'],
  })
  declare chats: ManyToMany<typeof Chat>

  public async getFriends() {
    const friends = await Friendship.query()
      .where('send_by', this.id as string)
      .orWhere('send_to', this.id as string)
      .orderBy('created_at', 'desc')
    return friends
  }

}