import { test } from '@japa/runner'
import User from '#models/user'

test.group('Auth - Register', (group) => {
  group.each.teardown(async () => {
    await User.query().delete()
  })

  test('un utilisateur peut créer un compte', async ({ client, assert }) => {
    const payload = {
      username: 'john_doe',
      email: 'john@example.com',
      password: 'Password123', // 8+ caractères, majuscule, chiffre
      gender: 'male',
      country: 'France',
    }
    const response = await client.post('/signup').form(payload)
    response.assertStatus(200)
    assert.equal(
      response.body().message,
      'Inscription effectuée. Merci de vérifier votre email (pour des raisons de test l email est déjà vérifié).'
    )
    const user = await User.findBy('email', payload.email)
    assert.exists(user)
    assert.equal(user?.username, payload.username)
    assert.isTrue(user?.isEmailVerified)
    const loginResponse = await client.post('/signin').form({
      email: payload.email,
      password: payload.password,
    })
    loginResponse.assertStatus(200)
    assert.isTrue(loginResponse.body().success)
    assert.equal(loginResponse.body().email, payload.email)
  })
})
