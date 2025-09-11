import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Chat from './chat.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: string
  
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

  static accessTokens = DbAccessTokensProvider.forModel(User)
  
  @manyToMany(() => User, {
    pivotTable: 'friendships',
  })
  declare friendships: ManyToMany<typeof User>

  @manyToMany(() => Chat)
  declare chats: ManyToMany<typeof Chat>
}