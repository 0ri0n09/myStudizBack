import { BaseSchema } from '@adonisjs/lucid/schema'
import CollaborationInvitationStatus from '#enums/collaborations_invitation_status'

export default class extends BaseSchema {
  protected tableName = 'users_collaborations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary()
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.uuid('collaborator_id').references('id').inTable('users').onDelete('CASCADE')
      table
        .enum('status', Object.values(CollaborationInvitationStatus))
        .notNullable()
        .defaultTo(CollaborationInvitationStatus.PENDING)
      table.unique(['user_id', 'collaborator_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
