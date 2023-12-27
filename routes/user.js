/*
 * @Author: younglina younglina0409@gmail.com
 * @Date: 2023-12-27 09:53:32
 * @Description: 用户路由
 */
const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const jwtMiddleware = require('../middlewares/jwt');

router.prefix('/user')

router.get('/', jwtMiddleware, async (ctx) => {
  const { getUser } = require('../model/user')
  const user = ctx.state.user || {}
  console.log(user);
  const result = await getUser(ctx.database)
  ctx.body = { data: result }
})

router.get('/login', async (ctx) => {
  const { name, password } = ctx.request.query
  const token = jwt.sign({ name, password }, 'woung', { algorithm: 'RS256', expiresIn: '10s' }); // 生成JWT令牌，有效期为1小时
  // 将JWT令牌设置为Cookie
  ctx.cookies.set('token', token, { httpOnly: true });
  ctx.body = { data: '1' }
})

router.get('/addUser', async (ctx) => {
  const { addUser } = require('../model/user')
  const { name, password } = ctx.request.query
  const result = await addUser(ctx.database, { name, password })
  ctx.body = { data: result }
})

module.exports = router
