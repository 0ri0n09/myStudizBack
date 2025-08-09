import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'folders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary()
      table.uuid('owner_id').references('id').inTable('users').onDelete('CASCADE')
      table.uuid('folder_parent_id').references('id').inTable('folders').onDelete('CASCADE')

      table.string('color', 7).notNullable().defaultTo('#1681ba')
      table.string('name').notNullable()
      table.string('description')

      table.jsonb('tags').defaultTo(null)
      table.timestamp('exam_date')

      table.boolean('is_public').notNullable().defaultTo(0)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
