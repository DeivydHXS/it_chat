import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_chats'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      
      table.uuid('user_id').references('users.id')
      table.uuid('chat_id').references('chats.id')
      table.unique(['user_id', 'chat_id'])

      table.string('permission_type').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}