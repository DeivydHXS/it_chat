import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { v4 } from 'uuid'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import Chat from './chat.js'
import User from './user.js'

export default class Message extends BaseModel {

  @beforeCreate()
  public static assignId(message: Message) {
    message.id = v4()
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare chat_id: string

  @column()
  declare user_id: string

  @column()
  declare type: string

  @column()
  declare content: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Chat)
  declare chat: BelongsTo<typeof Chat>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}