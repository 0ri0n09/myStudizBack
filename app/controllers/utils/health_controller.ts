import type { HttpContext } from '@adonisjs/core/http'
import Limiter from '@adonisjs/limiter/services/main'
import env from '#start/env'

export default class HealthController {
  async index({ request, response }: HttpContext): Promise<void> {
    const throttleKey = `health_${request.ip()}`

    const limiter = Limiter.use({
      requests: 30,
      duration: '1 mins',
      blockDuration: '2 mins',
    })

    if (await limiter.isBlocked(throttleKey)) {
      return response.tooManyRequests({
        message: 'Vous avez effectué trop de requêtes. Merci de réessayer plus tard.',
      })
    }

    await limiter.increment(throttleKey)

    const uptimeInSeconds = Math.floor(process.uptime())
    return response.ok({ uptime: uptimeInSeconds, version: env.get('API_VERSION') })
  }
}
