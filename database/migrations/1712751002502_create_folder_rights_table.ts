import { BaseSchema } from '@adonisjs/lucid/schema'
import FolderActionLevels from '#enums/folder_action_levels'

export default class extends BaseSchema {
  protected tableName = 'folder_rights'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('folder_id').references('id').inTable('folders').onDelete('CASCADE')
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
      table
        .enum('action_level', Object.values(FolderActionLevels))
        .notNullable()
        .defaultTo(FolderActionLevels.READ_FOLDER)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
