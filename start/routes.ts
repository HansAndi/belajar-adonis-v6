/* eslint-disable prettier/prettier */
/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'
const AuthController = () => import('#controllers/auth_controller')
const PostsController = () => import('#controllers/posts_controller')

// router.get('/', async () => {
//   return {
//     hello: 'world',
//   }
// })

router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger);
});

// Renders Swagger-UI and passes YAML-output of /swagger
router.get('/docs', async () => {
  return AutoSwagger.default.ui("/swagger", swagger);
  // return AutoSwagger.default.scalar('/swagger'); to use Scalar instead
  // return AutoSwagger.default.rapidoc("/swagger", "view"); to use RapiDoc instead (pass "view" default, or "read" to change the render-style)
});

router.group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])

    router.group(() => {
        router.post('/logout', [AuthController, 'logout'])
        router.post('/me', [AuthController, 'me'])
        router.resource('/posts', PostsController)
      }).use(middleware.auth())
}).prefix('api')

router.on('/').render('pages/home')
