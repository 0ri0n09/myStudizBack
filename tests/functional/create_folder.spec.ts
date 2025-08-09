import { test } from '@japa/runner'
import User from '#models/user'
import Folder from '#models/folder'
import Gender from '#enums/gender'

test.group('Folders - Create', (group) => {
  let authCookie: string
  let userId: string

  group.setup(async ({ client }) => {
    const user = await User.create({
      username: 'user',
      email: 'user@test.fr',
      password: 'password123',
      gender: Gender.MALE,
      country: 'France',
      isEmailVerified: true,
    })
    userId = user.id

    const loginResponse = await client.post('/signin').form({
      email: user.email,
      password: user.password,
    })

    authCookie = loginResponse.headers()['set-cookie'][0]
  })

  group.each.teardown(async () => {
    await Folder.query().delete()
    await User.query().delete()
  })

  test('un user peut créer un dossier', async ({ client, assert }) => {
    const payload = {
      name: 'Révisions maths',
      description: 'Dossier de révision pour le bac',
      color: '#ff0000',
      isPublic: false,
      tags: ['maths', 'bac'],
    }

    const response = await client.post('/folders').header('cookie', authCookie).form(payload)

    response.assertStatus(200)
    assert.equal(response.body().name, payload.name)
    const folder = await Folder.findBy('name', payload.name)
    assert.exists(folder)
    assert.equal(folder?.ownerId, userId)
    const listResponse = await client.get('/folders').header('cookie', authCookie)
    listResponse.assertStatus(200)
    assert.isTrue(listResponse.body().some((f: any) => f.name === payload.name))
  })
})
