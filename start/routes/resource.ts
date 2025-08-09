import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const ResourceController = () => import('#controllers/resource/resource_controller')

router
  .group(() => {
    router.post('/upload', [ResourceController, 'upload']).as('resource.upload')
    router
      .post('/uploadProfile', [ResourceController, 'uploadProfilePicture'])
      .as('resource.uploadProfile')
    router.get('/:id', [ResourceController, 'show']).as('resource.show')
  })
  .prefix('resource')
  .middleware(middleware.auth())
