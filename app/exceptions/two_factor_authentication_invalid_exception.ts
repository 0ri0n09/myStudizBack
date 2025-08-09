import { Exception } from '@adonisjs/core/exceptions'

export default class TwoFactorAuthenticationInvalidException extends Exception {
  constructor() {
    super('Le code 2FA est invalide.', {
      status: 401,
      code: 'E_2FA_INCORRECT',
    })
  }
}
