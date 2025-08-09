import router from '@adonisjs/core/services/router'

const HealthController = () => import('#controllers/utils/health_controller')

router
  .group(() => {
    router.get('/', [HealthController, 'index'])
  })
  .prefix('health')
