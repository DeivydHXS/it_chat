import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { v4 } from 'uuid'

export enum FriendshipStatus {
  Pending = 'p',
  Accepted = 'a',
  Blocked = 'b',
  Refused = 'r',
}

export default class Friendship extends BaseModel {
  public static selfAssignPrimaryKey = true

  @beforeCreate()
  public static assignId(friendship: Friendship) {
    friendship.id = v4()
  }

  @column({ isPrimary: true })
  declare id: string

  @column({ serializeAs: 'send_by' })
  declare send_by: string

  @column({ serializeAs: 'send_to' })
  declare send_to: string

  @column({ serializeAs: 'blocker_id' })
  declare blocker_id: string | null

  @column()
  declare status: FriendshipStatus
}
