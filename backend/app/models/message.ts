import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, beforeFetch, beforeFind, belongsTo, column, ModelQueryBuilder } from '@adonisjs/lucid/orm'
import { v4 } from 'uuid'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import Chat from './chat.js'
import User from './user.js'

export default class Message extends BaseModel {

  @beforeCreate()
  public static assignId(message: Message) {
    message.id = v4()
  }

  @beforeFetch()
  @beforeFind()
  public static ignoreDeleted(query: ModelQueryBuilder) {
    query.where('deleted', false)
  }

  @column({ isPrimary: true })
  declare id: string

  @column({ serializeAs: 'chat_id' })
  declare chat_id: string

  @column({ serializeAs: 'user_id' })
  declare user_id: string

  @column()
  declare type: string

  @column()
  declare content: string

  @column({ serializeAs: null })
  declare deleted: boolean

  @column.dateTime({ serializeAs: 'created_at', autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ serializeAs: 'updated_at', autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Chat, { foreignKey: 'chat_id' })
  declare chat: BelongsTo<typeof Chat>

  @belongsTo(() => User, { foreignKey: 'user_id' })
  declare user: BelongsTo<typeof User>
}