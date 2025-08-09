import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Token from '#models/token'
import mail from '@adonisjs/mail/services/main'
import PasswordResetNotification from '#mails/password_reset_notification'
import vine from '@vinejs/vine'
import { passwordResetValidator } from '#validators/auth/password_reset'

export default class UserPasswordResetsController {
  async send({ request, response }: HttpContext) {
    const data = request.all()
    const { email } = await passwordResetValidator.validate(data)
    const user = await User.findBy('email', email)
    const token = await Token.generatePasswordResetToken(user)

    if (user) {
      await mail.sendLater(new PasswordResetNotification(user, token))
      return response.ok({
        type: 'success',
        message: 'If an email match, you gonna recieve a reset link.',
      })
    } else {
      return response.notFound({
        type: 'error',
        message: "This email doesn't match with any account.",
      })
    }
  }

  async store({ request, response, auth }: HttpContext) {
    const data = request.all()
    const passwordSchema = vine.compile(
      vine.object({
        token: vine.string(),
        password: vine.string().minLength(8),
      })
    )

    const { token, password } = await passwordSchema.validate(data)
    const user = await Token.getTokenUser(token, 'PASSWORD_RESET')

    if (!user) {
      return response.notFound({
        type: 'error',
        message: 'Token expired or associated user could not be found.',
      })
    }

    await user.merge({ password }).save()
    await auth.use('web').login(user)
    await Token.expireTokens(user, 'passwordResetTokens')
    return response.ok({ type: 'success', message: 'Password change successfuly.' })
  }
}
