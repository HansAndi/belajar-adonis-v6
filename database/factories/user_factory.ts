import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { PostFactory } from '#database/factories/post_factory'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      fullName: faker.internet.userName(),
      email: faker.internet.email(),
      password: await hash.make('password'),
    }
  })
  .relation('posts', () => PostFactory)
  .build()
