import vine from '@vinejs/vine'
import { passwordHasAtLeastOneNumberRule, passwordHasAtLeastOneSymbolRule, passwordHasUpperAndLowercaseRule, passwordMinLengthRule } from './rules/password_rules.js'

/**
 * Validates the me's update action
 */
export const updateUserValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(50),
    nickname: vine.string().trim().minLength(1).maxLength(30),
    bio: vine.string().trim().minLength(0).maxLength(200).optional(),
    profile_image: vine.file({
      size: '20mb',
      extnames: ['jpg', 'png', 'jpeg']
    }).optional(),
    remove_image: vine.boolean().optional()
  })
)

/**
 * Validates the me's change password action
 */
export const changePasswordValidator = vine.compile(
  vine.object({
    password: vine.string().maxLength(30)
      .use(passwordMinLengthRule({}))
      .use(passwordHasUpperAndLowercaseRule({}))
      .use(passwordHasAtLeastOneNumberRule({}))
      .use(passwordHasAtLeastOneSymbolRule({})),
      password_confirmation: vine.string().sameAs('password')
  })
)