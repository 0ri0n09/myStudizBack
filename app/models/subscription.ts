import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import type { UUID } from '#types/common'
import { randomUUID } from 'node:crypto'

export default class Subscription extends BaseModel {
  @column({ isPrimary: true })
  declare id: UUID

  @column()
  declare userId: UUID

  @column.dateTime()
  declare expireAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static createUUID(subscription: Subscription) {
    subscription.id = randomUUID() as UUID
  }
}
