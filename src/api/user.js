/*
 * @Description: 用户相关接口
 * @Author: longzhang6
 * @Date: 2020-04-11 17:40:46
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-05-07 23:18:58
 */
import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function register(data) {
  return request({
    url: '/User/Regist',
    method: 'post',
    data
  })
}

export function registerPhoneVerify(params) {
  return request({
    url: '/User/Regist',
    method: 'get',
    params
  })
}
