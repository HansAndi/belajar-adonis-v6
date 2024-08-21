import factory from '@adonisjs/lucid/factories'
import Post from '#models/post'

export const PostFactory = factory
  .define(Post, async ({ faker }) => {
    return {
      title: faker.lorem.sentences(1),
      content: faker.lorem.paragraphs(3),
      
    }
  })
  .build()
