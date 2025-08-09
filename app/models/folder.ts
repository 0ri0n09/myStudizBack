import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { UUID } from '#types/common'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Note from '#models/note'
import FolderInvitation from '#models/folder_invitation'
import Mcq from '#models/mcq'
import { randomUUID } from 'node:crypto'

export default class Folder extends BaseModel {
  @column({ isPrimary: true })
  declare id: UUID

  @column()
  declare ownerId: UUID

  @column()
  declare folderParentId: string

  @column()
  declare name: string

  @column()
  declare description: string

  @column({
    prepare: (value: string[]) => JSON.stringify(value || []),
    consume: (value: any) => {
      if (Array.isArray(value)) return value
      if (value === null) return []
      try {
        return JSON.parse(value)
      } catch {
        if (typeof value === 'string') {
          return value ? value.split(',').map((tag) => tag.trim()) : []
        }
        return []
      }
    },
  })
  declare tags: string[]

  @column()
  declare color: string

  @column.dateTime()
  declare examDate: DateTime

  @column()
  declare isPublic: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Note)
  declare notes: HasMany<typeof Note>

  @hasMany(() => Mcq)
  declare mcqs: HasMany<typeof Mcq>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => FolderInvitation)
  declare folderInvations: HasMany<typeof FolderInvitation>

  @beforeCreate()
  static createUUID(folder: Folder) {
    folder.id = randomUUID() as UUID
  }
}
