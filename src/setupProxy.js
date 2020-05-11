/*
 * @Description: http-proxy-middleware
 * @Author: longzhang6
 * @Date: 2020-05-08 00:11:01
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-05-11 21:58:51
 */
const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    '/dev-api',
    createProxyMiddleware({
      target: 'https://www.liehuo360.com:360',
      changeOrigin: true,
      secure: true,
      pathRewrite: {
        '/dev-api': ''
      }
    })
  )
}
