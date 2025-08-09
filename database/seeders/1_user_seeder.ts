import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Role from '#enums/role'
import Gender from '#enums/gender'
import { randomUUID } from 'node:crypto'
import type { UUID } from '#types/common'

export default class UserSeeder extends BaseSeeder {
  async run() {
    if (process.env.NODE_ENV === 'production') {
      console.log('\n')
      console.error('❌ Seeding is not allowed in production environment !')
      return
    }
    console.log('\n')
    console.log('🌱 Seeding fake users...')

    const testUser = await User.create({
      id: randomUUID() as UUID,
      email: 'test@test.fr',
      password: 'test1234',
      username: 'TestUsername',
      role: Role.CLIENT,
      gender: Gender.MALE,
      country: 'France',
      isEmailVerified: true,
    })

    const premiumUser = await User.create({
      id: randomUUID() as UUID,
      email: 'premium@premium.fr',
      password: 'premium1234',
      username: 'TestPremium',
      role: Role.PREMIUM,
      gender: Gender.FEMALE,
      country: 'France',
      isEmailVerified: true,
    })

    const adminUser = await User.create({
      id: randomUUID() as UUID,
      email: 'admin@admin.fr',
      password: 'admin1234',
      username: 'TestAdmin',
      role: Role.ADMIN,
      gender: Gender.UNKNOWN,
      country: 'France',
      isEmailVerified: true,
    })

    /*const users = await Promise.all(
      Array.from({ length: 5 }).map(async () => {
        return User.create({
          email: faker.internet.email(),
          password: 'pwd123',
          username: faker.internet.username(),
          role: Role.CLIENT,
          isEmailVerified: false,
        })
      })
    )*/

    const users = []
    users.push(testUser)
    users.push(premiumUser)
    users.push(adminUser)

    console.info('✅ Fake users created !')
    console.log('=====================================================')
    console.log('|   Client  user : test@test.fr / test1234          |')
    console.log('|---------------------------------------------------|')
    console.log('|   Premium user : premium@premium.fr / premium1234 |')
    console.log('|---------------------------------------------------|')
    console.log('|   Admin   user : admin@admin.fr / admin1234       |')
    console.log('=====================================================')
  }
}
