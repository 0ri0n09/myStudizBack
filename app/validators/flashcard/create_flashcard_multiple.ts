import vine from '@vinejs/vine'
import FlashcardType from '#enums/flashcard_type'

export const createFlashcardMultipleValidator = vine.compile(
  vine.object({
    ownerId: vine.string(),
    folderId: vine.string(),
    tip: vine.string().optional(),
    note: vine.string().optional(),
    question: vine.string(),
    type: vine.enum(Object.values(FlashcardType)),
    answers: vine.object({
      options: vine
        .array(
          vine.object({
            answer: vine.string().minLength(1),
            isCorrect: vine.boolean(),
          })
        )
        .optional(),
    }),
  })
)
