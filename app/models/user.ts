import { DateTime } from 'luxon'
import { withAuthFinder } from '@adonisjs/auth'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, beforeCreate, column, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import type { UUID } from '#types/common'
import Role from '../enums/role.js'
import { randomUUID } from 'node:crypto'
import VerifyNotification from '#mails/verify_notification'
import PasswordResetNotification from '#mails/password_reset_notification'
import type { HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import Gender from '../enums/gender.js'
import Occupation from '#models/occupation'
import Subscription from '#models/subscription'
import Token from '#models/token'
import Folder from '#models/folder'
import Transaction from '#models/transaction'
import FolderInvitation from '#models/folder_invitation'
import mail from '@adonisjs/mail/services/main'
import FolderRight from '#models/folder_right'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email', 'username'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: UUID

  @column()
  declare username: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare country: string

  @column()
  declare isEmailVerified: boolean

  @column()
  declare role: Role

  @column()
  declare gender: Gender

  @column()
  declare twoFactorSecret: string | null

  @column()
  declare twoFactorEnabled: boolean

  @column()
  declare lastSeenAt: DateTime | null

  @column()
  declare ipAddress: string

  @column()
  declare resourceId: UUID | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @beforeCreate()
  static createUUID(user: User) {
    user.id = randomUUID() as UUID
  }

  @hasOne(() => Occupation)
  declare occupation: HasOne<typeof Occupation>

  @hasOne(() => Subscription)
  declare subscription: HasOne<typeof Subscription>

  @hasMany(() => Token)
  declare tokens: HasMany<typeof Token>

  @hasMany(() => Folder)
  declare folders: HasMany<typeof Folder>

  @hasMany(() => Transaction)
  declare transactions: HasMany<typeof Transaction>

  @hasMany(() => FolderInvitation)
  declare folderInvations: HasMany<typeof FolderInvitation>

  @manyToMany(() => FolderRight, {
    pivotTable: 'folder_rights',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'folder_id',
    pivotColumns: ['action_level'],
  })
  declare folderRights: ManyToMany<typeof FolderRight>

  @hasMany(() => Token, {
    onQuery: (query) => query.where('type', 'PASSWORD_RESET'),
  })
  declare passwordResetTokens: HasMany<typeof Token>

  @hasMany(() => Token, {
    onQuery: (query) => query.where('type', 'VERIFY_EMAIL'),
  })
  declare verifyEmailTokens: HasMany<typeof Token>

  async sendVerifyEmail() {
    const token = await Token.generateVerifyEmailToken(this)
    await mail.sendLater(new VerifyNotification(this, token))
  }

  async sendPasswordResetEmail() {
    const token = await Token.generatePasswordResetToken(this)
    await mail.sendLater(new PasswordResetNotification(this, token))
  }
}
