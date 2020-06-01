/*
 * @Description: 团队相关接口
 * @Author: longzhang6
 * @Date: 2020-05-13 22:08:44
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-06-01 21:10:43
 */
import request from '@/utils/request'

// 创建团队
export function createOrganization(data) {
  return request({
    url: '/Organize/CreateOrganize',
    method: 'post',
    data
  })
}

// 获取团队类型
export function getOrganizationType(data) {
  return request({
    url: '/Organize/OrganizeTypes',
    method: 'post',
    data
  })
}

// 获取待审批团队列表
export function queryApprovingList(data) {
  return request({
    url: '/Organize/Approving',
    method: 'post',
    data
  })
}

// 审批团队
export function getApproval(data) {
  return request({
    url: '/Organize/Approval',
    method: 'post',
    data
  })
}

// 获取待授权团队列表
export function queryAuthorizeList(data) {
  return request({
    url: '/Organize/Authorize',
    method: 'post',
    data
  })
}

// 获取已通过团队列表
export function queryApprovaledList(data) {
  return request({
    url: '/Organize/Appved',
    method: 'post',
    data
  })
}

// 获取已驳回团队列表
export function queryRejectedList(data) {
  return request({
    url: '/Organize/Rejected',
    method: 'post',
    data
  })
}

// 获取已加入的团队
export function getJoinedOrganizeList(data) {
  return request({
    url: '/Organize/Joined',
    method: 'post',
    data
  })
}

// 获取可授权菜单
export function getAuthorizableAppMenu(data) {
  return request({
    url: '/Organize/AppMenu4Empower',
    method: 'post',
    data
  })
}

// 团队授权
export function empower(data) {
  return request({
    url: '/Organize/Empower',
    method: 'post',
    data
  })
}
