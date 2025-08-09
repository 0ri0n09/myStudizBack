import { BaseSchema } from '@adonisjs/lucid/schema'
import Role from '../../app/enums/role.js'
import Gender from '../../app/enums/gender.js'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary()
      table.string('username', 36).notNullable().unique()
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()

      table.enum('role', Object.values(Role)).notNullable().defaultTo(Role.CLIENT)
      table.enum('gender', Object.values(Gender)).notNullable()

      table
        .integer('occupation_id')
        .unsigned()
        .references('id')
        .inTable('occupations')
        .onDelete('CASCADE')

      table.boolean('is_banned').notNullable().defaultTo(0)
      table.string('country').notNullable()

      table.string('two_factor_secret').nullable()
      table.boolean('two_factor_enabled').defaultTo(0).notNullable()

      table.timestamp('last_seen_at').nullable()
      table.string('ip_address').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
