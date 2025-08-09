import vine from '@vinejs/vine'

export const editFolderValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(50),
    description: vine.string().optional(),
    tags: vine.array(vine.string()).optional(),
    color: vine.string().optional(),
    isPublic: vine.boolean().optional(),
    folderParentId: vine.string().uuid().optional(),
  })
)
