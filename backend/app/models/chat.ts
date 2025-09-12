import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, manyToMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { type UUIDTypes, v4 } from 'uuid'

export default class Chat extends BaseModel {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  public static addId(chat: Chat) {
    chat.id = v4()
  }

  @column({ isPrimary: true })
  declare id: UUIDTypes

  @column()
  declare type: string

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

  @manyToMany(() => User)
  declare users: ManyToMany<typeof User>
}