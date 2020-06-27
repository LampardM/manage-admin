/*
 * @Description: 组织架构接口
 * @Author: longzhang6
 * @Date: 2020-06-01 21:11:50
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-06-27 16:15:00
 */
import request from '@/utils/request'

// 切换所在团队
export function switchDepartment(data) {
  return request({
    url: '/User/SwitchOrganize',
    method: 'post',
    data
  })
}

// 获取可用菜单
export function getCanuseMenu(data) {
  return request({
    url: '/Organize/LoadMenu',
    method: 'post',
    data
  })
}

// 获取团队组织架构列表
export function getCurDepartment(data) {
  return request({
    url: '/Organize/DepartmentTree',
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

// 编辑部门
export function updateDepartment(data) {
  return request({
    url: '/Organize/UpdateDepartment',
    method: 'post',
    data
  })
}

// 删除部门
export function deleteDepartment(data) {
  return request({
    url: '/Organize/DeleteDepartment',
    method: 'post',
    data
  })
}
