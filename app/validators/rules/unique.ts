import db from '@adonisjs/lucid/services/db'
import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

export type Options = {
  table: string
  column: string
}

async function unique(value: unknown, options: Options, field: FieldContext) {
  if (typeof value !== 'string') {
    return
  }

  if (!field.isValid) {
    return
  }

  const row = await db.from(options.table).where(options.column, value).first()

  if (row) {
    field.report('The {{ field }} field is not unique', 'unique', field)
  }
}

export const uniqueRule = vine.createRule(unique)
