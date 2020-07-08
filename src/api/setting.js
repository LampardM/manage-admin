/*
 * @Description: 团队设置
 * @Author: longzhang6
 * @Date: 2020-07-05 12:02:06
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-07-08 23:15:38
 */
import request from '@/utils/request'

// 获取团队手机号
export function getDepartmentPhone(data) {
  return request({
    url: '/Organize/OrganizeBingPhone',
    method: 'post',
    data
  })
}

// 获取团队转让手机验证码
export function getTransPhoneCode(data) {
  return request({
    url: '/Organize/OrganizeTransVerify',
    method: 'post',
    data
  })
}

// 获取团队接收手机验证码
export function getReceivePhoneCode(data) {
  return request({
    url: '/Organize/OrganizeReceiveVerify',
    method: 'post',
    data
  })
}

// 提交团队转让申请
export function submitTransDepart(data) {
  return request({
    url: '/Organize/PresentOrganizeTrans',
    method: 'post',
    data
  })
}

// 确认提交
export function lastSubmitTransDepart(data) {
  return request({
    url: '/Organize/PresentReceiveOrganize',
    method: 'post',
    data
  })
}
