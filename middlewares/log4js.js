const log4js = require('log4js')

log4js.configure({
  // 定义日志的输出位置，可以包括控制台输出和文件输出。可以根据日志级别分别配置不同的文件输出
  appenders: {
    consoleOut: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '%d{yyyy-MM-dd hh:mm:ss} [%p] %m',
      },
    },
    fileOut: {
      type: 'file',
      filename: `./logs/logger`,
      pattern: 'yyyy-MM-dd.log',
      layout: {
        type: 'pattern',
        pattern: '%d{yyyy-MM-dd hh:mm:ss} [%p] %m',
      },
      alwaysIncludePattern: true,
    },
    errorOut: {
      type: 'file',
      filename: `./logs/error`,
      pattern: 'yyyy-MM-dd.log',
      layout: {
        type: 'pattern',
        pattern: '%d{yyyy-MM-dd hh:mm:ss} [%p] %m',
      },
      alwaysIncludePattern: true,
    },
  },
  // categories定义日志的策略，可以根据日志级别选择不同的输出方式。
  categories: {
    default: {
      appenders: ['consoleOut', 'fileOut'],
      level: 'info',
    },
    error: {
      appenders: ['consoleOut', 'errorOut'],
      level: 'error',
    },
  },
})

module.exports = {
  info: (content) => {
    const logger = log4js.getLogger('info')
    logger.info(content)
  },
  error: (content) => {
    const logger = log4js.getLogger('error')
    logger.error(content)
  },
}
