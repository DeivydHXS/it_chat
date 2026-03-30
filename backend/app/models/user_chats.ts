import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { v4 } from 'uuid'

export enum UserChatsPermissionTypes {
  Member = 'm',
  CoAdmin = 'c',
  Admin = 'a',
}

export default class UserChats extends BaseModel {
  public static selfAssignPrimaryKey = true

  @beforeCreate()
  public static assignId(userChat: UserChats) {
    userChat.id = v4()
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare lastReadMessageId: string

  @column()
  declare chatId: string

  @column()
  declare permissionType: UserChatsPermissionTypes

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
