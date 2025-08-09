import type { HttpContext } from '@adonisjs/core/http'
import { assert } from '@poppinss/utils/assert'
import { UUID } from '#types/common'
import Flashcard from '#models/flashcard'
import FlashcardType from '#enums/flashcard_type'
import { createFlashcardSingleValidator } from '#validators/flashcard/create_flashcard_single'
import { createFlashcardMultipleValidator } from '#validators/flashcard/create_flashcard_multiple'

export default class FlashcardsController {
  async showAll({ auth, params, response }: HttpContext) {
    const user = auth.user
    assert(user)

    const folderId = params.folderId as UUID
    const flashcards = await Flashcard.query().where('folderId', folderId)
    if (flashcards.length === 0) {
      return response.notFound({
        type: 'information',
        message: 'Aucune flashcard trouvée pour ce dossier',
      })
    }
    return response.ok(flashcards)
  }

  async create({ request, response, auth }: HttpContext) {
    const user = auth.user
    assert(user)
    const { flashcards } = request.only(['flashcards'])
    if (!Array.isArray(flashcards)) {
      return response.badRequest({ message: 'flashcards must be an array' })
    }
    const flashcardsToInsert = flashcards.map((flashcard) => ({
      ...flashcard,
      ownerId: user.id,
    }))
    const createdFlashcards = await Flashcard.createMany(flashcardsToInsert)
    return response.ok(createdFlashcards)
  }

  async edit({ request, params, response, auth }: HttpContext) {
    const user = auth.user
    assert(user)

    const data = request.all()
    let payload
    if (params.type === FlashcardType.SINGLE) {
      payload = await createFlashcardSingleValidator.validate(data)
    } else {
      payload = await createFlashcardMultipleValidator.validate(data)
    }

    const flashcardId = params.flashcardId
    const existingFlashcard = await Flashcard.find(flashcardId)

    if (existingFlashcard) {
      const typedPayload = {
        ...(payload.ownerId ? { ownerId: payload.ownerId as unknown as UUID } : {}),
        ...(payload.folderId ? { folderId: payload.folderId as unknown as UUID } : {}),
        ...(payload.tip !== undefined ? { tip: payload.tip } : {}),
        ...(payload.note !== undefined ? { note: payload.note } : {}),
        ...(payload.question !== undefined ? { question: payload.question } : {}),
        ...(payload.type !== undefined ? { type: payload.type } : {}),
        ...(payload.answers !== undefined ? { answers: payload.answers } : {}),
      }
      existingFlashcard.merge(typedPayload)
      if (existingFlashcard.$isDirty) {
        await existingFlashcard.save()
      }
      return response.ok({
        type: 'success',
        message: 'Les modifications de votre flashcard ont bien été prises en compte.',
      })
    } else {
      return response.notFound({ type: 'error', message: "La flashcard n'existe pas." })
    }
  }

  async delete({ params, response, auth }: HttpContext) {
    const user = auth.user
    assert(user)

    const flashcardId = params.flashcardId as UUID
    const flashcard = await Flashcard.find(flashcardId)
    if (flashcard) {
      await flashcard.delete()
      return response.ok({
        flashcard: flashcard,
        type: 'success',
        message: 'Flashcard supprimée avec succès !',
      })
    } else {
      return response.notFound({ type: 'error', message: "Cette flashcard n'est pas disponible." })
    }
  }
}
