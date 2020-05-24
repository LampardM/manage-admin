/*
 * @Description: 登录态
 * @Author: longzhang6
 * @Date: 2020-04-11 16:04:13
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-05-24 17:44:53
 */
const LOGIN_COOKIE_NAME = 'sessionId'
const ORGANIZES_COOKIE_NAME = 'organizes'

export function isAuthenticated() {
  return _getCookie(LOGIN_COOKIE_NAME)
}

export function authenticateSuccess(token) {
  _setCookie(LOGIN_COOKIE_NAME, token)
}

export function logout() {
  _setCookie(LOGIN_COOKIE_NAME, '', 0)
  _setCookie(ORGANIZES_COOKIE_NAME, [], 0)
}

export function setCurOriganize(organizes) {
  _setCookie(ORGANIZES_COOKIE_NAME, organizes)
}

export function getCurOriganize() {
  return _getCookie(ORGANIZES_COOKIE_NAME)
}

function _getCookie(name) {
  let start, end
  if (document.cookie.length > 0) {
    start = document.cookie.indexOf(name + '=')
    if (start !== -1) {
      start = start + name.length + 1
      end = document.cookie.indexOf(';', start)
      if (end === -1) {
        end = document.cookie.length
      }
      return unescape(document.cookie.substring(start, end))
    }
  }
  return ''
}

function _setCookie(name, value, expire) {
  let date = new Date()
  date.setDate(date.getDate() + expire)
  document.cookie =
    name + '=' + escape(value) + '; path=/' + (expire ? ';expires=' + date.toGMTString() : '')
}
