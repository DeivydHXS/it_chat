import vine from '@vinejs/vine'

/**
 * Validates the me's update action
 */
export const updateUserValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(255).optional(),
    nickname: vine.string().trim().minLength(1).maxLength(50).optional(),
    bio: vine.string().trim().minLength(1).maxLength(1000).optional(),
    profile_image: vine.file({
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg']
    }).optional()
  })
)