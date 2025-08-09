import { BaseMail } from '@adonisjs/mail'
import User from '#models/user'
import env from '#start/env'

export default class VerifyNotification extends BaseMail {
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
      .subject('Please verify your Email')
      .from('no-reply@my-studiz.com')
      .to(this.user.email)
      .html(
        `Verify your Email by <a href="${env.get('FRONT_DOMAIN')}/auth/verify/${this.token}">clicking here</a>`
      )
  }
}
