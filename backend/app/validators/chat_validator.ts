import vine from "@vinejs/vine"

/**
 * Validates the chat's create group action
 */
export const createGroupValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(25),
    description: vine.string().trim().maxLength(200).optional(),
    icon_image: vine.file({
      size: '20mb',
      extnames: ['jpg', 'png', 'jpeg']
    }).optional(),
    cover_image: vine.file({
      size: '20mb',
      extnames: ['jpg', 'png', 'jpeg']
    }).optional()
  })
)

/**
 * Validates the chat's update group action
 */
export const updateGroupValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(25).optional(),
    description: vine.string().trim().maxLength(200).optional(),
    icon_image: vine.file({
      size: '20mb',
      extnames: ['jpg', 'png', 'jpeg']
    }).optional(),
    cover_image: vine.file({
      size: '20mb',
      extnames: ['jpg', 'png', 'jpeg']
    }).optional(),
    remove_icon: vine.boolean().optional(),
    remove_cover: vine.boolean().optional()
  })
)