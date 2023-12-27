const Koa = require('koa')

const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-json-error')
const bodyparser = require('koa-bodyparser')
const Database = require('better-sqlite3')
const logger = require('./middlewares/log4js')

const index = require('./routes/index')
const users = require('./routes/users')

// 配置跨域
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Credentials', 'true'); // 允许发送 Cookie
  ctx.set('Access-Control-Allow-Origin', ctx.request.header.origin); // 允许发送 Cookie
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // 允许的请求方法
  ctx.set('Access-Control-Allow-Headers', 'Content-Type');
  ctx.set('Content-Type', 'application/json;charset=utf-8');
  // 处理预检请求（OPTIONS请求）
  if (ctx.method === 'OPTIONS') {
    ctx.status = 204;
    ctx.body = ""
  } else {
    await next();
  }
});

// error handler
// 捕获由下游中间件抛出的错误，并通过发送适当的错误响应来处理它们
app.use(onerror({
  format: (err) => { // 返回错误的格式
    return { code: err.status, message: err.message, result: err.stack }
  },
  postFormat: (e, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest },
}))

// middlewares
// 解析请求体并将其存储在ctx.request.body属性中
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text'],
}))
// 将响应体转换为JSON格式，并设置适当的Content-Type头
app.use(json())
app.use(require('koa-static')(`${__dirname}/public`))

// sqlite
app.use(async (ctx, next) => {
  ctx.database = new Database('./database/data.db', { verbose: console.log }) // 将db挂在ctx上下文对象的database属性上
  await next()
})

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  logger.error(`${ctx.method} ${ctx.url} - ${err.stack}`)
})

module.exports = app
