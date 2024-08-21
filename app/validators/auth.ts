import vine, { VineString } from '@vinejs/vine'
import { uniqueRule, Options } from './rules/unique.js'

declare module '@vinejs/vine' {
  interface VineString {
    unique(options: Options): this
  }
}

VineString.macro('unique', function (this: VineString, options: Options) {
  return this.use(uniqueRule(options))
})

export const registerValidator = vine.compile(
  vine.object({
    full_name: vine.string().trim().minLength(6),
    email: vine.string().trim().email().unique({ table: 'users', column: 'email' }),
    password: vine.string().trim().minLength(6),
  })
)

/**
 * Validates the post's update action
 */
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim().minLength(6),
  })
)
