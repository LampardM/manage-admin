/*
 * @Description: 用户相关接口
 * @Author: longzhang6
 * @Date: 2020-04-11 17:40:46
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-07-15 22:36:50
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

// 创建新角色
export function createRole(data) {
  return request({
    url: '/User/createRole',
    method: 'post',
    data
  })
}

// 更新角色信息
export function updateRole(data) {
  return request({
    url: '/User/updateRole',
    method: 'post',
    data
  })
}

// 删除角色
export function deleteRoles(data) {
  return request({
    url: '/User/deleteRoles',
    method: 'post',
    data
  })
}

// 角色详情
export function roleDetail(data) {
  return request({
    url: '/User/RoleDetail',
    method: 'post',
    data
  })
}

// 加入团队
export function joinOrganize(data) {
  return request({
    url: '/User/JoinOrganize',
    method: 'post',
    data
  })
}

// 邀请加入团队信息
export function invitationInfo(data) {
  return request({
    url: '/User/InvitationInfo',
    method: 'post',
    data
  })
}

// 拒绝邀请加入
export function refuseInvitation(data) {
  return request({
    url: '/User/RefuseInvitation',
    method: 'post',
    data
  })
}

// 获取重置密码手机验证码
export function getResetPasswordVerify(params) {
  return request({
    url: `/User/ResetPasswordVcode/${params.phone}/${params.ticket}/${params.rand}`,
    method: 'get'
  })
}

// 重置密码
export function resetPassword(params) {
  return request({
    url: `/User/resetUserPassword/${params.phone}/${params.sms}/${params.newPassword}`,
    method: 'get'
  })
}

// 删除成员
export function deleteOrgMembers(payload) {
  return request({
    url: `/User/DeleteOrgMembers`,
    method: 'post',
    data: payload
  })
}
