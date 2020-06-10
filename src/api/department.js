/*
 * @Description: 组织架构接口
 * @Author: longzhang6
 * @Date: 2020-06-01 21:11:50
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-06-10 23:00:23
 */
import request from '@/utils/request'

// 获取可用菜单
export function getCanuseMenu(data) {
  return request({
    url: '/Organize/LoadMenu',
    method: 'post',
    data
  })
}

// 创建部门
export function createDepartment(data) {
  return request({
    url: '/Organize/CreateDepartment',
    method: 'post',
    data
  })
}
