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