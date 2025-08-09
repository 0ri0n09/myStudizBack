import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { UUID } from '#types/common'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import string from '@adonisjs/core/helpers/string'
import { randomUUID } from 'node:crypto'

type TokenType = 'PASSWORD_RESET' | 'VERIFY_EMAIL'
export default class Token extends BaseModel {
  @column({ isPrimary: true })
  declare id: UUID

  @column()
  declare userId: UUID

  @column()
  declare name: string

  @column()
  declare type: string

  @column()
  declare token: string

  @column.dateTime({ autoCreate: true })
  declare expiresAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  static async generatePasswordResetToken(user: User | null) {
    const token = string.generateRandom(64)

    if (!user) {
      return token
    }
    await Token.expireTokens(user, 'passwordResetTokens')
    const record = await user.related('tokens').create({
      type: 'PASSWORD_RESET',
      expiresAt: DateTime.now().plus({ hour: 1 }),
      token,
    })
    return record.token
  }

  static async expireTokens(
    user: User | null,
    relationName: 'passwordResetTokens' | 'verifyEmailTokens'
  ) {
    await user?.related(relationName).query().update({
      expiresAt: DateTime.now().toSQLDate(),
    })
  }

  static async getTokenUser(token: string, type: TokenType) {
    const record = await Token.query()
      .preload('user')
      .where('token', token)
      .where('type', type)
      .where('expiresAt', '>', DateTime.now().toString())
      .orderBy('createdAt', 'desc')
      .first()

    return record?.user
  }

  static async verify(token: string, type: TokenType) {
    const record = await Token.query()
      .where('expiresAt', '>', DateTime.now().toString())
      .where('token', token)
      .where('type', type)
      .first()
    return !!record
  }

  static async generateVerifyEmailToken(user: User) {
    const token = string.generateRandom(64)
    await Token.expireTokens(user, 'verifyEmailTokens')
    const record = await user.related('tokens').create({
      type: 'VERIFY_EMAIL',
      expiresAt: DateTime.now().plus({ hour: 24 }),
      token: token,
    })
    return record.token
  }

  @beforeCreate()
  static createUUID(token: Token) {
    token.id = randomUUID() as UUID
  }
}
