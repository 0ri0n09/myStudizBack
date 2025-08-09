import { test } from '@japa/runner'
import AuthController from '#controllers/auth/auth_controller'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

// Mocks globaux
let savedUser: any = null
let mockAuth: any = null

test.group('Unit - AuthController', () => {
  const fakeResponse = () => ({
    ok: (data: any) => data,
    unauthorized: (data: any) => ({ status: 401, ...data }),
    forbidden: (data: any) => ({ status: 403, ...data }),
    notFound: (data: any) => ({ status: 404, ...data }),
    status: function (code: number) {
      return { send: (msg: any) => ({ status: code, body: msg }) }
    },
    internalServerError: (data: any) => ({ status: 500, ...data }),
  })

  test('register crée un utilisateur et retourne un message de succès', async ({ assert }) => {
    const payload = {
      username: 'JohnDoe',
      password: 'secret',
      email: 'john@example.com',
      gender: 'male',
      country: 'FR',
    }

    // Mock validator
    const validatorSpy = (await import('#validators/auth/register')) as any
    validatorSpy.registerValidator = { validate: async () => payload }

    // Mock User
    User.prototype.save = async function () {
      savedUser = this
      return this
    }

    const controller = new AuthController()
    const result = await controller.register({
      request: { all: () => payload },
      response: fakeResponse(),
    } as any)

    assert.equal(result.message.includes('Inscription effectuée'), true)
    assert.equal(savedUser.email, payload.email)
  })

  test('login retourne erreur si identifiants invalides', async ({ assert }) => {
    const payload = { email: 'wrong@example.com', password: 'bad', remember: false }

    const validatorSpy = (await import('#validators/auth/login')) as any
    validatorSpy.loginValidator = { validate: async () => payload }

    User.verifyCredentials = async () => null

    const controller = new AuthController()
    const result = await controller.login({
      request: { all: () => payload },
      response: fakeResponse(),
      auth: {},
    } as any)

    assert.equal(result.status, 401)
    assert.equal(result.message, 'Incorrect email or password')
  })

  test('login retourne erreur si email non vérifié', async ({ assert }) => {
    const payload = { email: 'user@example.com', password: 'pass', remember: false }

    const validatorSpy = (await import('#validators/auth/login')) as any
    validatorSpy.loginValidator = { validate: async () => payload }

    User.verifyCredentials = async () => ({ isEmailVerified: false })

    const controller = new AuthController()
    const result = await controller.login({
      request: { all: () => payload },
      response: fakeResponse(),
      auth: {},
    } as any)

    assert.equal(result.status, 403)
    assert.equal(result.message, 'Email not verified')
  })

  test('login succès et connexion de l’utilisateur', async ({ assert }) => {
    const payload = { email: 'user@example.com', password: 'pass123' }
    const userMock = { email: payload.email, isEmailVerified: true }

    const validatorSpy = (await import('#validators/auth/login')) as any
    validatorSpy.loginValidator = { validate: async () => payload }

    User.verifyCredentials = async () => userMock

    mockAuth = {
      use: () => ({
        login: async () => true,
      }),
    }

    const controller = new AuthController()
    const result = await controller.login({
      request: { all: () => payload },
      response: fakeResponse(),
      auth: mockAuth,
    } as any)

    assert.isTrue(result.success)
    assert.equal(result.email, payload.email)
  })

  test('logout déconnecte l’utilisateur', async ({ assert }) => {
    mockAuth = {
      use: () => ({
        logout: async () => true,
      }),
    }

    const controller = new AuthController()
    const result = await controller.logout({
      response: fakeResponse(),
      auth: mockAuth,
    } as any)

    assert.isTrue(result.revoked)
  })

  test('me retourne l’utilisateur connecté', async ({ assert }) => {
    const userMock = { id: '1', email: 'me@example.com' }

    const controller = new AuthController()
    const result = await controller.me({
      response: fakeResponse(),
      auth: { user: userMock },
    } as any)

    assert.deepEqual(result, userMock)
  })

  test('editPassword retourne erreur si mots de passe ne correspondent pas', async ({ assert }) => {
    const controller = new AuthController()
    const result = await controller.editPassword({
      request: { all: () => ({ password_old: 'a', password: 'b', password_confirmation: 'c' }) },
      auth: { user: {} },
      response: fakeResponse(),
    } as any)

    assert.equal(result.status, 400)
  })

  test('editPassword retourne erreur si ancien mot de passe invalide', async ({ assert }) => {
    hash.verify = async () => false

    const controller = new AuthController()
    const result = await controller.editPassword({
      request: { all: () => ({ password_old: 'a', password: 'b', password_confirmation: 'b' }) },
      auth: { user: { password: 'hash' } },
      response: fakeResponse(),
    } as any)

    assert.equal(result.status, 400)
    assert.equal(result.body, 'Ancien mot de passe incorrect')
  })

  test('editPassword met à jour le mot de passe si tout est correct', async ({ assert }) => {
    let saved = false
    hash.verify = async () => true

    const controller = new AuthController()
    const result = await controller.editPassword({
      request: { all: () => ({ password_old: 'a', password: 'b', password_confirmation: 'b' }) },
      auth: {
        user: {
          password: 'hash',
          save: async () => {
            saved = true
          },
        },
      },
      response: fakeResponse(),
    } as any)

    assert.isTrue(saved)
    assert.equal(result.status, 200)
  })

  test('editUser met à jour et sauvegarde l’utilisateur', async ({ assert }) => {
    let mergedData: any = null
    let saved = false

    const controller = new AuthController()
    const result = await controller.editUser({
      request: { all: () => ({ username: 'newname' }) },
      auth: {
        user: {
          merge: (data: any) => {
            mergedData = data
          },
          save: async () => {
            saved = true
          },
        },
      },
      response: fakeResponse(),
    } as any)

    assert.deepEqual(mergedData, { username: 'newname' })
    assert.isTrue(saved)
    assert.equal(result.status, 200)
  })
})
