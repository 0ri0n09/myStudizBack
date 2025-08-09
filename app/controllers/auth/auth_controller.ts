import { HttpContext } from '@adonisjs/core/http'
import { registerValidator } from '#validators/auth/register'
import User from '#models/user'
import { loginValidator } from '#validators/auth/login'
//import UnverifiedAccountException from '#exceptions/unverified_account_exception'
import { assertNotNull } from '@poppinss/utils/assert'
import hash from '@adonisjs/core/services/hash'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const data = request.all()
    const payload = await registerValidator.validate(data)

    const { username, password, email, gender, country } = payload

    const user = new User()
    user.email = email
    user.username = username
    user.password = password
    user.gender = gender
    user.country = country
    user.isEmailVerified = true
    await user.save()
    //await user.sendVerifyEmail()
    return response.ok({
      message:
        'Inscription effectuée. Merci de vérifier votre email (pour des raisons de test l email est déjà vérifié).',
    })
  }

  async login({ request, response, auth }: HttpContext) {
    const data = request.all()
    const payload = await loginValidator.validate(data)
    const { email, password, remember } = payload
    const user = await User.verifyCredentials(email, password)
    let status

    if (!user) {
      status = 'INVALID_CREDENTIALS'
    } else if (!user.isEmailVerified) {
      status = 'EMAIL_NOT_VERIFIED'
    } else {
      status = 'SUCCESS'
    }

    switch (status) {
      case 'INVALID_CREDENTIALS':
        return response.unauthorized({
          success: false,
          message: 'Incorrect email or password',
        })
      case 'EMAIL_NOT_VERIFIED':
        return response.forbidden({
          success: false,
          message: 'Email not verified',
        })
      case 'SUCCESS':
        await auth.use('web').login(user, !!remember)
        return response.ok({
          success: true,
          email: user.email,
        })
      default:
        return response.internalServerError({
          success: false,
          message: 'Internal error',
        })
    }
  }

  async logout({ response, auth }: HttpContext) {
    await auth.use('web').logout()
    return response.ok({ revoked: true, message: 'Déconnexion effectuée.' })
  }

  async me({ response, auth }: HttpContext) {
    assertNotNull(auth.user)
    const user = auth.user!
    return response.ok(user)
  }

  async editPassword({ request, auth, response }: HttpContext) {
    assertNotNull(auth.user)
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { password_old, password, password_confirmation } = request.all()
    if (password !== password_confirmation) {
      return response.status(400).send('Les mots de passe ne correspondent pas')
    }
    // @ts-ignore
    const passwordValid = await hash.verify(auth.user.password, password_old)
    if (!passwordValid) {
      return response.status(400).send('Ancien mot de passe incorrect')
    }
    // @ts-ignore
    auth.user.password = password
    // @ts-ignore
    await auth.user.save()
    return response.status(200).send('Mot de passe mis à jour avec succès')
  }

  async editUser({ request, auth, response }: HttpContext) {
    assertNotNull(auth.user)
    const payload = request.all() as User
    // @ts-ignore
    auth.user.merge(payload)
    // @ts-ignore
    await auth.user.save()
    return response.status(200).send(auth.user)
  }
}
