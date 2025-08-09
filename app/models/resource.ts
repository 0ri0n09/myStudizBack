import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import type { UUID } from '#types/common'
import { randomUUID } from 'node:crypto'
import ResourceType from '#enums/resource_types'
import User from '#models/user'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Folder from '#models/folder'

export default class Resource extends BaseModel {
  @column({ isPrimary: true })
  declare id: UUID

  @column()
  declare originalFileName: string

  @column()
  declare fileName: string

  @column()
  declare resourceType: ResourceType

  @column()
  declare uploadedBy: UUID

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static createUUID(resource: Resource) {
    resource.id = randomUUID() as UUID
  }

  @belongsTo(() => User)
  declare profile: BelongsTo<typeof User>

  @manyToMany(() => Folder, {
    pivotTable: 'folder_resources',
  })
  declare tips: ManyToMany<typeof Folder>
}
