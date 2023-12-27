const router = require('koa-router')()

router.get('/', async (ctx) => {
  ctx.body = {
    title: '1koa2 json',
  }
})

router.get('/string', async (ctx) => {
  ctx.body = 'koa2 string'
})

module.exports = router
