import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const UserPasswordResetsController = () =>
  import('#controllers/auth/user_password_reset_controller')
const VerifyEmailsController = () => import('#controllers/auth/verify_emails_controller')

const AuthController = () => import('#controllers/auth/auth_controller')
const TwoFactorController = () => import('#controllers/auth/two_factors_controller')

router
  .group(() => {
    router.post('/signin', [AuthController, 'login']).as('auth.signin')
    router.post('/signup', [AuthController, 'register']).as('auth.signup')
    router.get('/me', [AuthController, 'me']).as('auth.me').middleware(middleware.auth())
    router.patch('/me/edit', [AuthController, 'editUser']).middleware(middleware.auth())
    router.post('/verify/:token', [VerifyEmailsController, 'verify']).as('verify.email.verify')
    router.post('/password/send', [UserPasswordResetsController, 'send']).as('password.send')
    router.post('/password/store', [UserPasswordResetsController, 'store']).as('password.store')
    router
      .post('/logout', [AuthController, 'logout'])
      .as('auth.logout')
      .middleware(middleware.auth())
    router.post('/password/edit', [AuthController, 'editPassword']).middleware(middleware.auth())

    router
      .group(() => {
        router.get('', [TwoFactorController, 'create']).as('2fa.create')
        router.post('', [TwoFactorController, 'store']).as('2fa.store')
        router.delete('', [TwoFactorController, 'remove']).as('2fa.remove')
      })
      .middleware(middleware.auth())
      .prefix('2fa')
  })
  .prefix('auth')
