import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_chats'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.uuid('last_read_message_id').nullable()
    })
  }

  async down() {
  }
}