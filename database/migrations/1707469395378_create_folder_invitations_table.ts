import { BaseSchema } from '@adonisjs/lucid/schema'
import FolderInvitationStatus from '#enums/folder_invitation_status'

export default class extends BaseSchema {
  protected tableName = 'folder_invitations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary()
      table.uuid('folder_id').references('id').inTable('folders').onDelete('CASCADE')
      table.uuid('invited_user_id').references('id').inTable('users').onDelete('CASCADE')
      table
        .enum('status', Object.values(FolderInvitationStatus))
        .notNullable()
        .defaultTo(FolderInvitationStatus.PENDING)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
