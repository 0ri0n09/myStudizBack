import type { HttpContext } from '@adonisjs/core/http'
import { assertNotNull } from '@poppinss/utils/assert'
import TwoFactorAuthService from '#services/two_factor_service'
import TwoFactorAuthenticationInvalidException from '#exceptions/two_factor_authentication_invalid_exception'

export default class TwoFactorsController {
  private twoFactorAuthService: TwoFactorAuthService

  constructor() {
    this.twoFactorAuthService = new TwoFactorAuthService()
  }

  async create({ auth, response }: HttpContext) {
    const user = auth.user!

    if (!user.twoFactorEnabled) {
      const { secret, uri } = this.twoFactorAuthService.generateSecret(user.username, user.email)
      await user.merge({ twoFactorSecret: secret }).save()

      const qrCode = await this.twoFactorAuthService.generateQrCode(uri)

      return response.ok({ qrCode })
    } else {
      return response.ok({ message: 'You are already protected by 2FA.' })
    }
  }

  async store({ request, auth, response }: HttpContext) {
    assertNotNull(auth.user, 'user is undefined')
    const user = auth.user!
    const token = request.input('pin')
    const secret = auth.user!.twoFactorSecret as string

    if (user.twoFactorEnabled) {
      return response.conflict({
        type: 'error',
        message: 'Two-factor authentication already activated.',
      })
    }

    if (!secret || !token || !this.twoFactorAuthService.verifyToken(secret, token)) {
      throw new TwoFactorAuthenticationInvalidException()
    }

    user.twoFactorEnabled = true
    await user.save()

    return response.ok({
      notification: { type: 'success', message: 'Two-factor authentication enabled successfully.' },
    })
  }

  async remove({ request, auth, response }: HttpContext) {
    assertNotNull(auth.user, 'user is undefined')
    const user = auth.user!
    const pin = request.input('pin')

    if (!pin || !this.twoFactorAuthService.verifyToken(user.twoFactorSecret!, pin)) {
      throw new TwoFactorAuthenticationInvalidException()
    }

    user.twoFactorEnabled = false
    user.twoFactorSecret = null
    await user.save()

    return response.ok({
      notification: {
        type: 'success',
        message: 'Two-factor authentication disabled successfully.',
      },
    })
  }
}
