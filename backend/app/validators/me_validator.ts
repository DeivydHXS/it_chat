import vine from '@vinejs/vine'
import { passwordHasAtLeastOneNumberRule, passwordHasAtLeastOneSymbolRule, passwordHasUpperAndLowercaseRule, passwordMinLengthRule } from './rules/password_rules.js'

/**
 * Validates the me's update action
 */
export const updateUserValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(255),
    nickname: vine.string().trim().minLength(1).maxLength(50),
    bio: vine.string().trim().minLength(1).maxLength(1000).optional(),
    profile_image: vine.file({
      size: '20mb',
      extnames: ['jpg', 'png', 'jpeg']
    }).optional()
  })
)

/**
 * Validates the me's change password action
 */
export const changePasswordValidator = vine.compile(
  vine.object({
    password: vine.string()
      .use(passwordMinLengthRule({}))
      .use(passwordHasUpperAndLowercaseRule({}))
      .use(passwordHasAtLeastOneNumberRule({}))
      .use(passwordHasAtLeastOneSymbolRule({})),
      password_confirmation: vine.string().sameAs('password')
  })
)