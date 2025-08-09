import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import User from '#models/user'
import Role from '../enums/role.js'

export default class CheckUserMiddleware {
  async handle({ params, auth, response }: HttpContext, next: NextFn) {
    const user = await User.find(params.id)

    if (
      (user && auth.user!.id === user.id) ||
      auth.user!.role === Role.MODERATOR ||
      auth.user!.role === Role.ADMIN
    ) {
      await next()
    } else {
      return response.status(403).json({ error: 'Access unauthorized' })
    }
  }
}
