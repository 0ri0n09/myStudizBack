import { BaseSchema } from '@adonisjs/lucid/schema'
import FlashcardType from '#enums/flashcard_type'

export default class extends BaseSchema {
  protected tableName = 'flashcards'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary()
      table.uuid('owner_id').references('id').inTable('users').onDelete('CASCADE').notNullable()
      table.uuid('folder_id').references('id').inTable('folders').onDelete('CASCADE').notNullable()

      //table.string('name').references('id').inTable('ressources').onDelete('CASCADE')
      table.text('tip')
      table.text('note')

      table.text('question').notNullable()
      table.jsonb('answers').notNullable()

      table.enum('type', Object.values(FlashcardType)).notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
