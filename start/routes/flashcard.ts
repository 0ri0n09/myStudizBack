import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const FlashcardsController = () => import('#controllers/flashcard/flashcards_controller')

router
  .group(() => {
    router.post('/', [FlashcardsController, 'create']).as('flashcard.create')
    router.get('/:folderId', [FlashcardsController, 'showAll']).as('flashcard.showAll')
    router.delete('/:flashcardId', [FlashcardsController, 'delete']).as('flashcard.delete')
    router.patch('/:flashcardId', [FlashcardsController, 'edit']).as('flashcard.edit')
  })
  .prefix('flashcard')
  .middleware(middleware.auth())
