import Post from '#models/post'
import type { HttpContext } from '@adonisjs/core/http'
import { createPostValidator, updatePostValidator } from '#validators/post'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import drive from '@adonisjs/drive/services/main'

export default class PostsController {
  async index({ response }: HttpContext) {
    const posts = await Post.query().preload('user')

    await Promise.all(
      posts.map(async (post) => {
        if (post.image) {
          const path = await drive.use().getUrl(post.image)
          post.image = path || null
        }
      })
    )

    const data = posts.map((post) =>
      post.serialize({
        fields: ['id', 'title', 'content', 'image'],
        relations: {
          user: {
            fields: ['id', 'name'],
          },
        },
      })
    )

    response.status(200).json({
      data: data,
    })
  }

  async store({ request, response, auth }: HttpContext) {
    const { title, content, image, categoryId } = await request.validateUsing(createPostValidator)

    const key = `uploads/${cuid()}.${image?.extname}`

    if (image) {
      // await image.move(app.makePath('storage/uploads'), {
      //   name: `${cuid()}.${image.extname}`,
      // })
      await image.moveToDisk(key)
    }

    const post = await auth.user!.related('posts').create({
      title,
      content,
      image: image ? key : null,
      categoryId: categoryId,
    })

    response.status(201).json({
      data: post,
    })
  }

  async show({ response, params }: HttpContext) {
    const post = await Post.query().preload('user').where('id', params.id).first()

    if (post && post.image) {
      const path = await drive.use().getUrl(post.image)
      post.image = post.image ? `${path}` : null
    }

    const data = post?.serialize({
      fields: ['id', 'title', 'content', 'image'],
      relations: {
        user: {
          fields: ['id', 'name'],
        },
      },
    })

    response.status(200).json({
      data: data,
    })
  }

  async update({ request, response, params }: HttpContext) {
    const post = await Post?.findOrFail(params.id)

    const { title, content, image, categoryId } = await request.validateUsing(updatePostValidator)

    const key = `uploads/${cuid()}.${image?.extname}`
    if (image) {
      if (post.image) {
        await drive.use().delete(post.image)
      }
      await image.moveToDisk(key)
    }

    await post
      .merge({
        title,
        content,
        image: image && key,
        categoryId,
      })
      .save()

    response.status(200).json({
      data: post,
    })
  }

  async destroy({ response, params }: HttpContext) {
    const post = await Post.findOrFail(params.id)

    await post.delete()

    response.noContent()
  }
}
