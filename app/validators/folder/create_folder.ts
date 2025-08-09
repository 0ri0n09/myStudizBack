import vine from '@vinejs/vine'

export const createFolderValidator = vine.compile(
  vine.object({
    folderParentId: vine.string().optional(),
    name: vine.string().maxLength(50),
    description: vine.string().optional(),
    tags: vine.array(vine.string()).optional(),
    color: vine.string().optional(),
    isPublic: vine.boolean(),
  })
)
