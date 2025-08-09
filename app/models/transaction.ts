import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import type { UUID } from '#types/common'
import PaymentMethod from '#enums/payment_method'
import { randomUUID } from 'node:crypto'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: UUID

  @column()
  declare userId: UUID

  @column()
  declare txId: string

  @column()
  declare amount: number

  @column()
  declare method: PaymentMethod

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static createUUID(transaction: Transaction) {
    transaction.id = randomUUID() as UUID
  }
}
