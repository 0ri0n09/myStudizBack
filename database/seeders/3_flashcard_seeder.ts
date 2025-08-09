import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { faker } from '@faker-js/faker'
import type { UUID } from '#types/common'
import { randomUUID } from 'node:crypto'
import User from '#models/user'
import Folder from '#models/folder'
import Flashcard from '#models/flashcard'
import FlashcardType from '#enums/flashcard_type'

export default class FlashcardSeeder extends BaseSeeder {
  async run() {
    if (process.env.NODE_ENV === 'production') {
      console.log('\n')
      console.error('❌ Seeding is not allowed in production environment !')
      return
    }
    console.log('🌱 Seeding fake flashcards...')

    const users = await User.all()
    await Promise.all(
      users.map(async (user) => {
        const userFolders = await Folder.query().where('ownerId', user.id)
        if (userFolders.length === 0) {
          console.log(`User ${user.id} has no folders, skipping flashcard creation...`)
          return
        }

        return Promise.all(
          userFolders.map(async (folder) => {
            return Promise.all(
              Array.from({ length: faker.number.int({ min: 10, max: 15 }) }).map(async () => {
                const type = faker.helpers.arrayElement(Object.values(FlashcardType))
                let question
                let answers

                if (type === FlashcardType.SINGLE) {
                  question = faker.lorem.words({ min: 5, max: 8 }) + ' ?'
                  answers = {
                    answer: faker.lorem.sentence(),
                  }
                } else if (type === FlashcardType.MULTIPLE) {
                  question = faker.lorem.words({ min: 5, max: 8 }) + ' ?'
                  const options = Array.from({ length: faker.number.int({ min: 2, max: 4 }) }).map(
                    () => ({
                      answer: faker.lorem.sentence(),
                      isCorrect: false,
                    })
                  )
                  options[faker.number.int({ min: 0, max: options.length - 1 })].isCorrect = true
                  answers = {
                    options,
                  }
                }

                return Flashcard.create({
                  id: randomUUID() as UUID,
                  ownerId: user.id,
                  folderId: folder.id,
                  tip: faker.datatype.boolean() ? faker.lorem.sentence() : null,
                  note: faker.datatype.boolean() ? faker.lorem.paragraph() : null,
                  question,
                  answers,
                  type,
                })
              })
            )
          })
        )
      })
    )
    console.info('✅ Fake flashcards created !')
  }
}
