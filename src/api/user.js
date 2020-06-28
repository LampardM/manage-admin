/*
 * @Description: 用户相关接口
 * @Author: longzhang6
 * @Date: 2020-04-11 17:40:46
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-05-18 20:32:50
 */
import request from '@/utils/request'

// 验证码登录
export function LoginByPhone(data) {
  return request({
    url: '/User/LoginByPhone',
    method: 'post',
    data
  })
}

// 密码登录
export function LoginByPassword(data) {
  return request({
    url: '/User/LoginByPassword',
    method: 'post',
    data
  })
}

// 获取登录手机验证码
export function loginPhoneVerify(params) {
  return request({
    url: `/User/LoginVcode/${params.ticket}/${params.rand}/${params.phone}`,
    method: 'get'
  })
}

// 登出
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 注册
export function register(data) {
  return request({
    url: '/User/Regist',
    method: 'post',
    data
  })
}

// 注册验证码获取
export function registerPhoneVerify(params) {
  return request({
    url: `/User/RegistVcode/${params.ticket}/${params.rand}/${params.phone}`,
    method: 'get'
  })
}

// 获取用户消息
export function getUserMessages(data) {
  return request({
    url: '/User/MyNewMessages',
    method: 'post',
    data
  })
}

// 所有角色
export function getRoleList(data) {
  return request({
    url: '/User/RoleList',
    method: 'post',
    data
  })
}

// 启用角色
export function enabledRoles(data) {
  return request({
    url: '/User/enabledRoles',
    method: 'post',
    data
  })
}

// 禁用角色
export function disabledRoles(data) {
  return request({
    url: '/User/disabledRoles',
    method: 'post',
    data
  })
}

// 获取角色权限配置表
export function getRolePowerConfig(data) {
  return request({
    url: '/User/RolePowerConfig',
    method: 'post',
    data
  })
}
