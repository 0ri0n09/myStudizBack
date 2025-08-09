import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import type { UUID } from '#types/common'

export default class FolderResource extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare folderId: UUID

  @column()
  declare resourceId: UUID

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
