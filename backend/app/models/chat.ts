import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { v4 } from 'uuid'
import Message from './message.js'

export default class Chat extends BaseModel {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  public static addId(chat: Chat) {
    chat.id = v4()
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare type: string

  @column()
  declare name: string | null
  
  @column()
  declare description: string | null

  @column()
  declare cover_image_url: string | null

  @column()
  declare icon_image_url: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => User, {
    pivotTable: 'user_chats'
  })
  declare users: ManyToMany<typeof User>

  @hasMany(() => Message)
  declare messages: HasMany<typeof Message>
}