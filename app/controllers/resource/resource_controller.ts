import Resource from '#models/resource'
import { cuid } from '@adonisjs/core/helpers'
import drive from '@adonisjs/drive/services/main'
import { HttpContext } from '@adonisjs/core/http'
import { promises as fs } from 'node:fs'
import ResourceType from '#enums/resource_types'
import FolderResource from '#models/folder_resource'

export default class ResourceController {
  async upload({ request, response, auth }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    // TODO real validator
    /**
     * Step 1: Grab the image from the request and perform basic
     * validations
     */
    const inputFile = request.file('file', {
      size: '2mb',
      extnames: ['jpeg', 'jpg', 'png', 'webp', 'pdf', 'doc', 'docx'],
    })

    if (!inputFile) {
      return response.badRequest({ error: 'Image missing' })
    }

    if (!inputFile.isValid) {
      return response.badRequest({ error: inputFile.errors })
    }
    /**
     * Step 2: Move the inputFile with a unique name using Drive
     */
    const key: string = `uploads/${cuid()}.${inputFile.extname}`

    try {
      // Lire le fichier temporaire et l'uploader sur S3
      const fileContents = await fs.readFile(inputFile.tmpPath!)
      const disk = drive.use('s3')
      await disk.put(key, fileContents)

      const data = request.all()
      const resource = await Resource.create({
        originalFileName: inputFile.clientName,
        fileName: key,
        resourceType: ResourceType.RESOURCE,
        uploadedBy: user.id,
      })

      await resource.save()

      const folderResource = await FolderResource.create({
        folderId: data.folderId,
        resourceId: resource.id,
      })

      await folderResource.save()

      return response.created({
        message: 'Image uploaded',
        url: await disk.getUrl(key),
        resource,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Erreur lors de l’upload du fichier',
        error: error.message,
      })
    }
  }

  async uploadProfilePicture({ request, response, auth }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    // TODO real validator
    /**
     * Step 1: Grab the image from the request and perform basic
     * validations
     */
    const inputFile = request.file('file', {
      size: '2mb',
      extnames: ['jpeg', 'jpg', 'png', 'webp'],
    })

    if (!inputFile) {
      return response.badRequest({ error: 'Image missing' })
    }

    if (!inputFile.isValid) {
      return response.badRequest({ error: inputFile.errors })
    }
    /**
     * Step 2: Move the inputFile with a unique name using Drive
     */
    const key: string = `uploads/${cuid()}.${inputFile.extname}`

    try {
      // Lire le fichier temporaire et l'uploader sur S3
      const fileContents = await fs.readFile(inputFile.tmpPath!)
      const disk = drive.use('s3')
      await disk.put(key, fileContents)

      const resource = await Resource.create({
        originalFileName: inputFile.clientName,
        fileName: key,
        resourceType: ResourceType.AVATAR,
        uploadedBy: user.id,
      })
      await resource.save()

      user.resourceId = resource.id
      await user.save()

      return response.created({
        message: 'Image uploaded',
        url: await disk.getUrl(key),
        resource,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Erreur lors de l’upload du fichier',
        error: error.message,
      })
    }
  }

  async show({ auth, params, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    const resourceId = params.id
    const resource = await Resource.query().where('id', resourceId).first()

    if (!resource) {
      return response.notFound({ type: 'error', message: "Ce dossier n'existe pas." })
    }
    return response.ok({ resource })
  }
}
