import vine from '@vinejs/vine'
import FlashcardType from '#enums/flashcard_type'

export let createFlashcardSingleValidator = vine.compile(
  vine.object({
    ownerId: vine.string(),
    folderId: vine.string(),
    tip: vine.string().optional(),
    note: vine.string().optional(),
    question: vine.string(),
    type: vine.enum(Object.values(FlashcardType)),
    answers: vine.object({}).optional(),
  })
)
