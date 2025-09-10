import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'chats'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('name', 254).notNullable()
      table.string('type', 1).notNullable().comment('p - chat privado | g - chat em grupo')
      table.string('description').nullable()
      table.string('cover_image_url').nullable()
      table.string('icon_image_url').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}