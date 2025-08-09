import { Exception } from '@adonisjs/core/exceptions'

export default class UnverifiedAccountException extends Exception {
  constructor() {
    super('Merci de vérifier votre email avant de vous connecter.', {
      status: 401,
      code: 'EMAIL_NOT_VERIFIED',
    })
  }
}
