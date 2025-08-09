import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { faker } from '@faker-js/faker'
import User from '#models/user'
import Folder from '#models/folder'
import { randomUUID } from 'node:crypto'
import type { UUID } from '#types/common'

export default class FolderSeeder extends BaseSeeder {
  async run() {
    if (process.env.NODE_ENV === 'production') {
      console.log('\n')
      console.error('❌ Seeding is not allowed in production environment !')
      return
    }
    console.log('🌱 Seeding fake folders...')

    const users = await User.all()

    await Promise.all(
      users.map(async (user) => {
        return Promise.all(
          Array.from({ length: 10 }).map(async () => {
            return Folder.create({
              id: randomUUID() as UUID,
              ownerId: user.id,
              name: faker.lorem.words(1),
              description: faker.lorem.sentence({ min: 10, max: 30 }),
              color: faker.color.rgb(),
              tags: faker.helpers.arrayElements([
                faker.lorem.words(1),
                faker.lorem.words(1),
                faker.lorem.words(1),
                faker.lorem.words(1),
              ]),
              isPublic: true,
            })
          })
        )
      })
    )
    console.info('✅ Fake folders created !')
  }
}
