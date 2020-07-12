/*
 * @Description: 成员管理接口
 * @Author: longzhang6
 * @Date: 2020-06-28 21:18:28
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-07-12 14:36:36
 */
import request from '@/utils/request'

// 邀请记录
export function invitationRecord(data) {
  return request({
    url: '/User/Invitaion',
    method: 'post',
    data
  })
}

// 已加入成员列表
export function invitedRecord(data) {
  return request({
    url: '/User/OrgMemberByPage',
    method: 'post',
    data
  })
}

// 邀请成员
export function inviteMember(data) {
  return request({
    url: '/User/InviteOrgMember',
    method: 'post',
    data
  })
}
