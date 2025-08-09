import { BaseMail } from '@adonisjs/mail'
import User from '#models/user'
import env from '#start/env'

export default class PasswordResetNotification extends BaseMail {
  constructor(
    private user: User,
    private token: string
  ) {
    super()
  }

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  prepare() {
    this.message
      .subject('Reset your password')
      .from('no-reply@mystudiz.fr')
      .to(this.user.email)
      .html(
        `Reset your password by <a href="${env.get('FRONT_DOMAIN')}/auth/password-reset/${this.token}">clicking here</a>`
      )
  }
}
