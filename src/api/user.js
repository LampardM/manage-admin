/*
 * @Description: 用户相关接口
 * @Author: longzhang6
 * @Date: 2020-04-11 17:40:46
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-05-11 22:21:42
 */
import request from '@/utils/request'

export function LoginByPhone(data) {
  return request({
    url: '/User/LoginByPhone',
    method: 'post',
    data
  })
}

export function LoginByPassword(data) {
  return request({
    url: '/User/LoginByPassword',
    method: 'post',
    data
  })
}

export function loginPhoneVerify(params) {
  return request({
    url: `/User/LoingVcode/${params.ticket}/${params.rand}/${params.phone}`,
    method: 'get'
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
    url: `/User/RegistVcode/${params.ticket}/${params.rand}/${params.phone}`,
    method: 'get'
  })
}
