import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import type { UUID } from '#types/common'
import { randomUUID } from 'node:crypto'
import FolderActionLevels from '#enums/folder_action_levels'

export default class FolderRight extends BaseModel {
  @column({ isPrimary: true })
  declare id: UUID

  @column()
  declare folderId: UUID

  @column()
  declare UserId: UUID

  @column()
  declare actionLevel: FolderActionLevels

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static createUUID(folderRight: FolderRight) {
    folderRight.id = randomUUID() as UUID
  }
}
