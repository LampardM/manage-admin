/*
 * @Description: 成员管理接口
 * @Author: longzhang6
 * @Date: 2020-06-28 21:18:28
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-07-19 17:03:54
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

// 获取成员信息
export function getMemberDetail(data) {
  return request({
    url: '/User/MemberDetail',
    method: 'post',
    data
  })
}

// 编辑成员
export function updateMemberDetail(data) {
  return request({
    url: '/User/UpdateMemberDetail',
    method: 'post',
    data
  })
}
