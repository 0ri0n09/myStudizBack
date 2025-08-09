import { BaseSchema } from '@adonisjs/lucid/schema'
import ResourceType from '#enums/resource_types'

export default class extends BaseSchema {
  protected tableName: string = 'resources'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary()
      table.string('original_file_name', 255).notNullable()
      table.string('file_name', 255).notNullable()
      table.enum('resource_type', Object.values(ResourceType)).notNullable()
      table.uuid('uploaded_by').references('id').inTable('users').onDelete('CASCADE').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
