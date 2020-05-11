/*
 * @Description: http-proxy-middleware
 * @Author: longzhang6
 * @Date: 2020-05-08 00:11:01
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-05-10 21:55:38
 */
const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    '/dev-api',
    createProxyMiddleware({
      target: 'https://www.liehuo360.com:8080',
      changeOrigin: true,
      secure: true,
      pathRewrite: {
        '/dev-api': ''
      }
    })
  )
}
