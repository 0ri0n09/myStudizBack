import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const FoldersController = () => import('#controllers/folder/folders_controller')

router
  .group(() => {
    router.get('/', [FoldersController, 'showAll']).as('folder.showAll')
    router.get('/options', [FoldersController, 'showAllOptions']).as('folder.showAllOptions')
    router.get('/:id', [FoldersController, 'show']).as('folder.show')
    router.post('/', [FoldersController, 'create']).as('folder.create')
    router.delete('/:id', [FoldersController, 'delete']).as('folder.delete')
    router.patch('/:id', [FoldersController, 'edit']).as('folder.edit')

    router
      .post('/:id/rights/:userId', [FoldersController, 'addUserRights'])
      .as('folder.addUserRights')
    router
      .patch('/:id/rights/:userId', [FoldersController, 'updateUserRights'])
      .as('folder.updateUserRights')
    router
      .delete('/:id/rights/:userId', [FoldersController, 'removeUserRights'])
      .as('folder.removeUserRights')
  })
  .prefix('folder')
  .middleware(middleware.auth())
