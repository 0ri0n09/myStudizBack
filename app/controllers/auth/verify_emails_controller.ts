import type { HttpContext } from '@adonisjs/core/http'
import Token from '#models/token'

export default class VerifyEmailsController {
  async verify({ response, params }: HttpContext) {
    const token = params.token
    const isValid = await Token.verify(token, 'VERIFY_EMAIL')

    if (isValid) {
      const customer = await Token.getTokenUser(token, 'VERIFY_EMAIL')
      if (customer) {
        customer.isEmailVerified = true
        await customer.save()
        await Token.expireTokens(customer, 'verifyEmailTokens')
        return response.ok({
          type: 'success',
          message: 'Email successfuly verified.',
          token: token,
        })
      }
    } else {
      return response.notFound({ type: 'error', message: 'Your token is invalid or expired.' })
    }
  }
}
