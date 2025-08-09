import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import type { UUID } from '#types/common'
import FolderInvitationStatus from '#enums/folder_invitation_status'
import { randomUUID } from 'node:crypto'

export default class FolderInvitation extends BaseModel {
  @column({ isPrimary: true })
  declare id: UUID

  @column()
  declare folderId: UUID

  @column()
  declare invitedUserId: UUID

  @column()
  declare status: FolderInvitationStatus

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static createUUID(folderInvitation: FolderInvitation) {
    folderInvitation.id = randomUUID() as UUID
  }
}
