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
    birthday: vine.date().beforeOrEqual((field) => {
      return dayjs().subtract(12, 'year').format('YYYY-MM-DD')
    }),
    email: vine.string().email().trim().unique(async (db, value, field) => {
      const user = await db
        .from('users')
        .where('email', value)
        .first()
      return !user
    }),
    password: vine.string()
                  .use(passwordMinLengthRule({}))
                  .use(passwordHasUpperAndLowercaseRule({}))
                  .use(passwordHasAtLeastOneNumberRule({}))
                  .use(passwordHasAtLeastOneSymbolRule({}))
                  .confirmed(),
    password_confirmation: vine.string()
  })
)

