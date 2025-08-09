import { test } from '@japa/runner'
import FoldersController from '#controllers/folder/folders_controller'
import Folder from '#models/folder'
import User from '#models/user'
import FolderRight from '#models/folder_right'

test.group('Unit - FoldersController', () => {
  const fakeAuth = (userId = 'uuid-user') => ({ user: { id: userId } })

  test('showAll retourne la liste des dossiers de l’utilisateur', async ({ assert }) => {
    const controller = new FoldersController()

    const foldersMock = [
      { id: '1', name: 'Maths', ownerId: 'uuid-user' },
      { id: '2', name: 'Physique', ownerId: 'uuid-user' },
    ]

    Folder.query = () =>
      ({
        select: () => ({
          where: () => ({
            andWhereNull: () => foldersMock,
          }),
        }),
      }) as any

    const responseMock = { ok: (data: any) => data }
    const result = await controller.showAll({
      auth: fakeAuth(),
      response: responseMock as any,
    } as any)

    assert.deepEqual(result, foldersMock)
  })

  test('show retourne 404 si le dossier est introuvable', async ({ assert }) => {
    const controller = new FoldersController()

    Folder.query = () =>
      ({
        preload: () => ({
          preload: () => ({
            where: () => ({
              first: async () => null,
            }),
          }),
        }),
      }) as any

    const responseMock = { notFound: (data: any) => data }
    const result = await controller.show({
      auth: fakeAuth(),
      params: { id: '123' },
      response: responseMock as any,
    } as any)

    assert.equal(result.type, 'error')
  })

  test('create crée un dossier avec les bonnes données', async ({ assert }) => {
    const controller = new FoldersController()

    let createdData: any
    Folder.create = async (data: any) => {
      createdData = data
      return { id: 'new-folder', ...data }
    }

    const responseMock = { ok: (data: any) => data }
    const result = await controller.create({
      request: { all: () => ({}) },
      response: responseMock as any,
      auth: fakeAuth(),
    } as any)

    assert.equal(result.name, 'Révisions Maths')
    assert.equal(createdData.ownerId, 'uuid-user')
  })

  test('edit met à jour un dossier existant', async ({ assert }) => {
    const controller = new FoldersController()

    const saveSpy = async () => true
    Folder.find = async () =>
      ({
        merge: (data: any) => Object.assign({}, data),
        $isDirty: true,
        save: saveSpy,
      }) as any

    const responseMock = { ok: (data: any) => data }
    const result = await controller.edit({
      request: { all: () => ({}) },
      params: { id: 'folder-1' },
      response: responseMock as any,
      auth: fakeAuth(),
    } as any)

    assert.equal(result.type, 'success')
  })

  test('delete supprime un dossier existant', async ({ assert }) => {
    const controller = new FoldersController()

    const deleteSpy = async () => true
    Folder.find = async () =>
      ({
        delete: deleteSpy,
      }) as any

    const responseMock = { ok: (data: any) => data }
    const result = await controller.delete({
      params: { id: 'folder-1' },
      response: responseMock as any,
      auth: fakeAuth(),
    } as any)

    assert.equal(result.type, 'success')
  })

  test('addUserRights attache un utilisateur à un dossier', async ({ assert }) => {
    const controller = new FoldersController()

    const relatedMock = { attach: async (data: any) => data }
    User.findOrFail = async () =>
      ({
        related: () => relatedMock,
      }) as any

    const responseMock = { ok: (data: any) => data }
    const result = await controller.addUserRights({
      params: { id: 'folder-1', userId: 'user-2' },
      request: { input: () => 'read' },
      response: responseMock as any,
      auth: fakeAuth(),
    } as any)

    assert.equal(result.message, 'Droits ajoutés avec succès.')
  })

  test('updateUserRights met à jour le niveau de droit', async ({ assert }) => {
    const controller = new FoldersController()

    FolderRight.query = () =>
      ({
        where: () => ({
          andWhere: () => ({
            update: async () => true,
          }),
        }),
      }) as any

    const responseMock = { ok: (data: any) => data }
    const result = await controller.updateUserRights({
      params: { id: 'folder-1', userId: 'user-2' },
      request: { input: () => 'write' },
      response: responseMock as any,
      auth: fakeAuth(),
    } as any)

    assert.equal(result.message, 'Droits mis à jour avec succès.')
  })

  test('removeUserRights détache un utilisateur du dossier', async ({ assert }) => {
    const controller = new FoldersController()

    User.findOrFail = async () =>
      ({
        related: () => ({
          detach: async () => true,
        }),
      }) as any

    const responseMock = { ok: (data: any) => data }
    const result = await controller.removeUserRights({
      params: { id: 'folder-1', userId: 'user-2' },
      response: responseMock as any,
      auth: fakeAuth(),
    } as any)

    assert.equal(result.message, 'Droits supprimés avec succès.')
  })
})
