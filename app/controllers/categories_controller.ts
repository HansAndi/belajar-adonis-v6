import type { HttpContext } from '@adonisjs/core/http'

import Category from '#models/category'

export default class CategoriesController {
  async index({ response }: HttpContext) {
    const categories = await Category.all()

    if (!categories) {
      response.status(404).json({
        success: false,
        message: 'No categories found',
      })
    }

    response.status(200).json({
      success: true,
      data: categories,
    })
  }

  async store({ request, response }: HttpContext) {
    const name = request.input('name')

    const category = await Category.create({ name })

    response.status(201).json({
      success: true,
      data: category,
    })
  }

  async show({ response, params }: HttpContext) {
    const category = await Category.findOrFail(params.id)

    response.status(200).json({
      success: true,
      data: category,
    })
  }

  async update({ request, response, params }: HttpContext) {
    const category = await Category.findOrFail(params.id)

    category.name = request.input('name')

    await category.save()

    response.status(200).json({
      success: true,
      data: category,
    })
  }

  async destroy({ response, params }: HttpContext) {
    const category = await Category.findOrFail(params.id)

    await category.delete()

    response.noContent()
  }
}
