import type { HttpContext } from '@adonisjs/core/http'
import { assert } from '@poppinss/utils/assert'
import { UUID } from '#types/common'
import Folder from '#models/folder'
import User from '#models/user'
import FolderRight from '#models/folder_right'
import { createFolderValidator } from '#validators/folder/create_folder'
import { editFolderValidator } from '#validators/folder/edit_folder'

export default class FoldersController {
  async showAll({ auth, response }: HttpContext) {
    const user = auth.user
    assert(user)
    try {
      const folders = await Folder.query()
        .select('id', 'ownerId', 'name', 'color', 'examDate', 'isPublic', 'tags')
        .where('ownerId', user.id)
        .andWhereNull('folder_parent_id')
      //.orWhere('folder_parent_id', '')
      return response.ok(folders)
    } catch (error) {
      console.error('Erreur de requête:', error)
      return response.internalServerError({
        message: 'Erreur lors de la récupération des dossiers',
        details: error.message,
      })
    }
  }

  async showAllOptions({ auth, response }: HttpContext) {
    const user = auth.user
    assert(user)
    try {
      const folders = await Folder.query().select('id', 'name').where('ownerId', user.id)
      if (folders.length === 0) {
        return response.ok({
          message: 'Aucun dossier trouvé pour cet utilisateur',
          folders: [],
        })
      }
      return response.ok(folders)
    } catch (error) {
      console.error('Erreur de requête:', error)
      return response.internalServerError({
        message: 'Erreur lors de la récupération des dossiers',
        details: error.message,
      })
    }
  }

  async show({ auth, params, response }: HttpContext) {
    const user = auth.user
    assert(user)

    const folderId = params.id
    const folder = await Folder.query()
      .preload('mcqs')
      .preload('notes')
      .where('id', folderId)
      .first()

    if (!folder) {
      return response.notFound({ type: 'error', message: "Ce dossier n'existe pas." })
    }
    return response.ok(folder)
  }

  async create({ request, response, auth }: HttpContext) {
    const user = auth.user
    assert(user)

    const data = request.all()
    const payload = await createFolderValidator.validate(data)

    const folder = await Folder.create({
      name: payload.name,
      description: payload.description,
      ownerId: user.id,
      folderParentId: payload.folderParentId as UUID,
      color: payload.color,
      isPublic: payload.isPublic,
      tags: payload.tags,
    })
    return response.ok(folder)
  }

  async edit({ request, params, response, auth }: HttpContext) {
    const user = auth.user
    assert(user)

    const data = request.all()
    const payload = await editFolderValidator.validate(data)

    const folderId = params.id
    const existingFolder = await Folder.find(folderId)

    if (existingFolder) {
      // Fusionner les nouvelles données avec les données existantes
      existingFolder.merge(payload)

      // Sauvegarder seulement si des modifications ont été apportées
      if (existingFolder.$isDirty) {
        await existingFolder.save()
        return response.ok({
          type: 'success',
          message: 'Les modifications de votre dossier ont bien été prises en compte.',
        })
      }
    } else {
      return response.notFound({ type: 'error', message: "Le dossier n'existe pas." })
    }
  }

  async delete({ params, response, auth }: HttpContext) {
    const user = auth.user
    assert(user)

    const folderId = params.id
    const folder = await Folder.find(folderId)
    if (folder) {
      await folder.delete()
      return response.ok({
        folder: folder,
        type: 'success',
        message: 'Dossier supprimé avec succès !',
      })
    } else {
      return response.notFound({ type: 'error', message: "Ce dossier n'est pas disponible." })
    }
  }

  async addUserRights({ params, request, response, auth }: HttpContext) {
    const authUser = auth.user
    assert(authUser)
    //const data = request.all()

    const { id: folderId, userId } = params
    const actionLevel = request.input('action_level')

    try {
      const user = await User.findOrFail(userId)
      await user.related('folderRights').attach({
        [folderId]: {
          action_level: actionLevel,
        },
      })
      return response.ok({ message: 'Droits ajoutés avec succès.' })
    } catch (error) {
      return response.internalServerError({
        message: "Erreur lors de l'ajout des droits: " + error,
      })
    }
  }

  async updateUserRights({ params, request, response, auth }: HttpContext) {
    const authUser = auth.user
    assert(authUser)

    const { id: folderId, userId } = params
    const actionLevel = request.input('action_level')

    try {
      await FolderRight.query()
        .where('user_id', userId)
        .andWhere('folder_id', folderId)
        .update({ action_level: actionLevel })
      return response.ok({ message: 'Droits mis à jour avec succès.' })
    } catch (error) {
      return response.internalServerError({
        message: 'Erreur lors de la mise à jour des droits: ' + error,
      })
    }
  }

  async removeUserRights({ params, response, auth }: HttpContext) {
    const authUser = auth.user
    assert(authUser)

    const { id: folderId, userId } = params

    try {
      const user = await User.findOrFail(userId)
      await user.related('folderRights').detach([folderId])
      return response.ok({ message: 'Droits supprimés avec succès.' })
    } catch (error) {
      return response.internalServerError({ message: 'Erreur lors de la suppression des droits.' })
    }
  }
}
