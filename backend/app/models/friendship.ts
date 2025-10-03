import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { type UUIDTypes, v4 } from 'uuid'

export default class Friendship extends BaseModel {
    static selfAssignPrimaryKey = true

    @beforeCreate()
    public static addId(friendship: Friendship) {
        friendship.id = v4()
    }

    @column({ isPrimary: true })
    declare id: UUIDTypes

    @column()
    declare send_by: UUIDTypes

    @column()
    declare send_to: UUIDTypes

    @column()
    declare status: string
}