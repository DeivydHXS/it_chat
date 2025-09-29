import vine from '@vinejs/vine'
import {
  passwordHasAtLeastOneNumberRule,
  passwordHasAtLeastOneSymbolRule,
  passwordHasUpperAndLowercaseRule,
  passwordMinLengthRule
} from './rules/password_rules.js'
import dayjs from 'dayjs'


/**
 * Validates the auth's register action
 */
export const registerAuthValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(255),
    nickname: vine.string().trim().minLength(1).maxLength(50),
    birthday: vine.date().beforeOrEqual(() => {
      return dayjs().subtract(12, 'year').format('YYYY-MM-DD')
    }),
    email: vine.string().email().trim().unique({ table: 'users', column: 'email' }),
    password: vine.string()
      .use(passwordMinLengthRule({}))
      .use(passwordHasUpperAndLowercaseRule({}))
      .use(passwordHasAtLeastOneNumberRule({}))
      .use(passwordHasAtLeastOneSymbolRule({})),
    password_confirmation: vine.string().sameAs('password'),
  })
)

/**
 * Validates the auth's login action
 */
export const loginAuthValidation = vine.compile(
  vine.object({
    email: vine.string().email().trim().exists({ table: 'users', column: 'email' }),
    password: vine.string()
      .use(passwordMinLengthRule({}))
      .use(passwordHasUpperAndLowercaseRule({}))
      .use(passwordHasAtLeastOneNumberRule({}))
      .use(passwordHasAtLeastOneSymbolRule({}))
  })
)

/**
 * Validates the auth's code verification action
 */
export const codeVerificationValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().exists({ table: 'users', column: 'email' }),
    code: vine.number().exists({ table: 'users', column: 'verification_code' })
  })
)

/**
 * Validates the auth's forgot password action
 */
export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email().exists({ table: 'users', column: 'email' }),
  })
)

/**
 * Validates the auth's is email not used action
 */
export const isEmailNotUsedValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
  })
)

/**
 * Validates the auth's change password action
 */
export const changePasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email().exists({ table: 'users', column: 'email' }),
    code: vine.number(),
    password: vine.string()
      .use(passwordMinLengthRule({}))
      .use(passwordHasUpperAndLowercaseRule({}))
      .use(passwordHasAtLeastOneNumberRule({}))
      .use(passwordHasAtLeastOneSymbolRule({})),
      password_confirmation: vine.string().sameAs('password')
  })
)