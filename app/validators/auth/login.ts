import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().trim(),
    remember: vine.boolean().optional(),
    twoFactor: vine.string().optional(),
  })
)
