import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('verification_code').nullable()
      table.string('status', 2).nullable().comment('p - pendente | a - aprovado')
    })
  }

  async down() {
  }
}