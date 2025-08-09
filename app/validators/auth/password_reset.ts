import vine from '@vinejs/vine'

export const passwordResetValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
  })
)
