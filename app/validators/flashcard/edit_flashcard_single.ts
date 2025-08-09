import vine from '@vinejs/vine'
import FlashcardType from '#enums/flashcard_type'

export const editFlashcardSingleValidator = vine.compile(
  vine.object({
    ownerId: vine.string().optional(),
    folderId: vine.string().optional(),
    color: vine.string().optional(),
    tip: vine.string().optional(),
    note: vine.string().optional(),
    question: vine.string().optional(),
    type: vine.enum(Object.values(FlashcardType)).optional(),
    answers: vine
      .object({
        answer: vine.string().minLength(1),
      })
      .optional(),
  })
)
