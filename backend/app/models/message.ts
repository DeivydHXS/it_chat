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
  
  @column({ columnName: 'chat_id' })
  declare chatId: string

  @column({ columnName: 'user_id' })
  declare userId: string
  @column()
  declare type: string

  @column()
  declare content: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
 
  @belongsTo(() => Chat, { foreignKey: 'chat_id' })
  declare chat: BelongsTo<typeof Chat>

  @belongsTo(() => User, { foreignKey: 'user_id' })
  declare user: BelongsTo<typeof User>

}