import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import type { UUID } from '#types/common'
import { randomUUID } from 'node:crypto'
import CollaborationInvitationStatus from '#enums/collaborations_invitation_status'

export default class UserCollaborations extends BaseModel {
  @column({ isPrimary: true })
  declare id: UUID

  @column()
  declare userId: UUID

  @column()
  declare collaboratorId: UUID

  @column()
  declare status: CollaborationInvitationStatus

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static createUUID(userCollaborations: UserCollaborations) {
    userCollaborations.id = randomUUID() as UUID
  }
}
