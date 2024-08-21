import vine from '@vinejs/vine'

export const createPostValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(6),
    content: vine.string().trim().minLength(6),
    image: vine.file({
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    }),
    categoryId: vine.number().positive(),
  })
)

/**
 * Validates the post's update action
 */
export const updatePostValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(6),
    content: vine.string().trim().minLength(6),
    image: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg'],
      })
      .optional(),
    categoryId: vine.number().positive(),
  })
)
