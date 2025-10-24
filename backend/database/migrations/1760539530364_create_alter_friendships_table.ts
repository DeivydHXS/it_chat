import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'friendships'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.uuid('blocker_id').nullable()
    })
  }

  async down() {
  }
}