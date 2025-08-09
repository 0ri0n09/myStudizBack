import { test } from '@japa/runner'
import FlashcardsController from '#controllers/flashcard/flashcards_controller'
import Flashcard from '#models/flashcard'
import FlashcardType from '#enums/flashcard_type'

let savedFlashcards: any[] = []

// Fake response helper
const fakeResponse = () => ({
  ok: (data: any) => ({ status: 200, body: data }),
  notFound: (data: any) => ({ status: 404, body: data }),
  badRequest: (data: any) => ({ status: 400, body: data }),
})

test.group('Unit - FlashcardsController', (group) => {
  group.each.setup(() => {
    savedFlashcards = []

    // Mock query() → where()
    Flashcard.query = () =>
      ({
        where: async () => savedFlashcards,
      }) as any

    // Mock createMany
    Flashcard.createMany = async (data: any[]) => {
      savedFlashcards.push(...data)
      return data
    }

    // Mock find
    Flashcard.find = async (id: string) => savedFlashcards.find((f) => f.id === id) || null
  })

  // --- showAll ---
  test('showAll retourne 404 si aucune flashcard trouvée', async ({ assert }) => {
    const controller = new FlashcardsController()
    const result = await controller.showAll({
      auth: { user: { id: 'u1' } },
      params: { folderId: 'f1' },
      response: fakeResponse(),
    } as any)

    assert.equal(result.status, 404)
    assert.include(result.body.message, 'Aucune flashcard trouvée')
  })

  test('showAll retourne les flashcards si trouvées', async ({ assert }) => {
    savedFlashcards.push({ id: 'fc1', folderId: 'f1' })

    const controller = new FlashcardsController()
    const result = await controller.showAll({
      auth: { user: { id: 'u1' } },
      params: { folderId: 'f1' },
      response: fakeResponse(),
    } as any)

    assert.equal(result.status, 200)
    assert.deepEqual(result.body, savedFlashcards)
  })

  // --- create ---
  test('create retourne 400 si flashcards n’est pas un tableau', async ({ assert }) => {
    const controller = new FlashcardsController()
    const result = await controller.create({
      auth: { user: { id: 'u1' } },
      request: { only: () => ({ flashcards: 'pas un tableau' }) },
      response: fakeResponse(),
    } as any)

    assert.equal(result.status, 400)
  })

  test('create insère et retourne les flashcards', async ({ assert }) => {
    const flashcardsData = [{ id: 'fc1', question: 'Q1' }]
    const controller = new FlashcardsController()
    const result = await controller.create({
      auth: { user: { id: 'u1' } },
      request: { only: () => ({ flashcards: flashcardsData }) },
      response: fakeResponse(),
    } as any)

    assert.equal(result.status, 200)
    assert.lengthOf(savedFlashcards, 1)
    assert.equal(savedFlashcards[0].ownerId, 'u1')
  })

  // --- edit ---
  test('edit retourne 404 si la flashcard n’existe pas', async ({ assert }) => {
    const controller = new FlashcardsController()
    const result = await controller.edit({
      auth: { user: { id: 'u1' } },
      request: { all: () => ({}) },
      params: { type: FlashcardType.SINGLE, flashcardId: 'notfound' },
      response: fakeResponse(),
    } as any)

    assert.equal(result.status, 404)
  })

  test('edit met à jour la flashcard et retourne succès', async ({ assert }) => {
    const flashcard = {
      id: 'fc1',
      merge: function (data: any) {
        Object.assign(this, data)
        this.$isDirty = true
      },
      save: async function () {
        return this
      },
    }
    savedFlashcards.push(flashcard)

    // Mock validator
    const createFlashcardSingleValidator = require('#validators/flashcard/create_flashcard_single')
    createFlashcardSingleValidator.createFlashcardSingleValidator = {
      validate: async (d: any) => d,
    }

    const controller = new FlashcardsController()
    const result = await controller.edit({
      auth: { user: { id: 'u1' } },
      request: { all: () => ({ tip: 'Nouvelle astuce' }) },
      params: { type: FlashcardType.SINGLE, flashcardId: 'fc1' },
      response: fakeResponse(),
    } as any)

    assert.equal(result.status, 200)
    assert.include(result.body.message, 'modifications')
  })

  // --- delete ---
  test('delete retourne 404 si flashcard introuvable', async ({ assert }) => {
    const controller = new FlashcardsController()
    const result = await controller.delete({
      auth: { user: { id: 'u1' } },
      params: { flashcardId: 'notfound' },
      response: fakeResponse(),
    } as any)

    assert.equal(result.status, 404)
  })

  test('delete supprime la flashcard et retourne succès', async ({ assert }) => {
    const flashcard = {
      id: 'fc1',
      delete: async function () {
        savedFlashcards = savedFlashcards.filter((f) => f.id !== this.id)
      },
    }
    savedFlashcards.push(flashcard)

    const controller = new FlashcardsController()
    const result = await controller.delete({
      auth: { user: { id: 'u1' } },
      params: { flashcardId: 'fc1' },
      response: fakeResponse(),
    } as any)

    assert.equal(result.status, 200)
    assert.lengthOf(savedFlashcards, 0)
  })
})
