import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import type { UUID } from '#types/common'
import { randomUUID } from 'node:crypto'

export default class Note extends BaseModel {
  @column({ isPrimary: true })
  declare id: UUID

  @column()
  declare folderId: UUID

  @column()
  declare note: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static createUUID(note: Note) {
    note.id = randomUUID() as UUID
  }
}
