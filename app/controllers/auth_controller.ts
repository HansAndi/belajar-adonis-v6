import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator, registerValidator } from '#validators/auth'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    await request.validateUsing(registerValidator)

    const isEmailExist = await User.findBy('email', request.input('email'))

    if (isEmailExist) {
      response.abort('Email Sudah Terdaftar')
    }

    const user = await User.create({
      fullName: request.input('full_name'),
      email: request.input('email'),
      password: request.input('password'),
    })

    const token = await User.accessTokens.create(user)

    response.status(201).json({
      token: token,
      data: user,
    })
  }

  async login({ request, response }: HttpContext) {
    // const { email, password } = request.only(['email', 'password'])
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    return response.status(200).json({
      token: token,
      data: user,
    })
  }

  async logout({ auth, response }: HttpContext) {
    const user = await auth.authenticate()
    const token = user.currentAccessToken

    try {
      await User.accessTokens.delete(user, token.identifier)
    } catch (error) {
      response.status(500).json({
        success: false,
        message: error.message,
      })
    }

    response.status(200).json({
      message: 'Logged out successfully',
    })
  }

  async me({ auth, response }: HttpContext) {
    const user = await auth.authenticate()

    const data = user.serialize({
      fields: {
        pick: ['id', 'name', 'email'],
      },
    })

    response.status(200).json({
      data: data,
    })
  }
}
