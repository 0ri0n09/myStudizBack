import vine from '@vinejs/vine'
import { unique } from '#helpers/db'
import Gender from '#enums/gender'

export const registerValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .trim()
      .email()
      .unique(unique('users', 'email', { caseInsensitive: true })),
    username: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(26)
      .unique(unique('users', 'username', { caseInsensitive: true })),
    password: vine.string().trim().minLength(8),
    country: vine.string(),
    gender: vine.enum(Object.values(Gender)),
  })
)
