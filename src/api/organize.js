/*
 * @Description: 团队相关接口
 * @Author: longzhang6
 * @Date: 2020-05-13 22:08:44
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-05-13 22:09:58
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
