import { BaseSchema } from '@adonisjs/lucid/schema'
import PaymentMethod from '../../app/enums/payment_method.js'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary()
      table.uuid('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('tx_id').notNullable().unique()
      table.double('amount').notNullable()
      table.enum('method', Object.values(PaymentMethod)).notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
