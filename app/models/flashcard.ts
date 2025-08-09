import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { UUID } from '#types/common'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Folder from '#models/folder'
import FlashcardType from '#enums/flashcard_type'
import { randomUUID } from 'node:crypto'

export default class Flashcard extends BaseModel {
  @column({ isPrimary: true })
  declare id: UUID

  @column()
  declare ownerId: UUID

  @column()
  declare folderId: UUID

  @column()
  declare tip: string | null

  @column()
  declare note: string | null

  @column()
  declare question: string

  @column({
    prepare: (value: any) => JSON.stringify(value || {}),
    consume: (value: any) => {
      if (typeof value === 'object') return value
      if (value === null) return {}
      try {
        return JSON.parse(value)
      } catch {
        return {}
      }
    },
  })
  declare answers: Record<string, any>

  @column()
  declare type: (typeof FlashcardType)[keyof typeof FlashcardType]

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'ownerId',
  })
  declare owner: BelongsTo<typeof User>

  @belongsTo(() => Folder)
  declare folder: BelongsTo<typeof Folder>

  @beforeCreate()
  static createUUID(flashcard: Flashcard) {
    flashcard.id = randomUUID() as UUID
  }
}
