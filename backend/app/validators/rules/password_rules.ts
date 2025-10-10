import vine from '@vinejs/vine'
import type { FieldContext } from '@vinejs/vine/types'

async function passwordMinLength(
    value: unknown,
    options: {},
    field: FieldContext
) {
    if (typeof value !== 'string') {
        return
    }

    if (value.length < 8) {
        field.report(
            'O campo de senha deve ter pelo menos 8 caracteres.',
            'password_must_have_at_least_eight_characters',
            field
        )
    }
}

async function passwordHasUpperAndLowercase(
    value: unknown,
    options: {},
    field: FieldContext
) {
    if (typeof value !== 'string') {
        return
    }

    if (!/[A-Z]/.test(value) && !/[a-z]/.test(value)) {
        field.report(
            'O campo de senha deve conter pelo menos uma letra maiúscula e uma minúscula.',
            'password_must_have_at_least_one_upper_and_one_lowercase_letter',
            field
        )
    }
}

async function passwordHasAtLeastOneNumber(
    value: unknown,
    options: {},
    field: FieldContext
) {
    if (typeof value !== 'string') {
        return
    }

    if (!/[0-9]/.test(value)) {
        field.report(
            'O campo de senha deve conter pelo menos um número.',
            'password_must_have_at_least_one_number',
            field,
        )
    }
}

async function passwordHasAtLeastOneSymbol(
    value: unknown,
    options: {},
    field: FieldContext
) {
    if (typeof value !== 'string') {
        return
    }

    if (!/[/(!)(\?)(#)(@)(\.)(%)(,)(\\)(\|)(;)(:)/g]/.test(value)) {
        field.report(
            'O campo de senha deve conter pelo menos um caracter especial.',
            'password_must_have_at_least_one_symbol',
            field
        )
    }
}

export const passwordMinLengthRule = vine.createRule(passwordMinLength)
export const passwordHasUpperAndLowercaseRule = vine.createRule(passwordHasUpperAndLowercase)
export const passwordHasAtLeastOneNumberRule = vine.createRule(passwordHasAtLeastOneNumber)
export const passwordHasAtLeastOneSymbolRule = vine.createRule(passwordHasAtLeastOneSymbol)
