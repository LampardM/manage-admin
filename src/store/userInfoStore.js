/*
 * @Description: 登录态store
 * @Author: longzhang6
 * @Date: 2020-04-11 16:08:12
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-05-16 14:05:58
 */
import { observable, action } from 'mobx'
import { isAuthenticated, authenticateSuccess, logout } from '@/utils/session'

class UserInfoStore {
  @observable isLogin = !!isAuthenticated() // 利用cookie来判断用户是否登录，避免刷新页面后登录状态丢失
  @observable appId = '2049930508' // 验证码id
  @observable version = '1.0.0' // 接口版本号
  @observable loginUser = {} // 当前登录用户信息
  @observable appCode = 'yedmYB6NtF' // 关联平台号
  @observable platformCode = 'yedmY86Ntd' // 关联平台号
  @observable organizes = [] // 当前用户已加入团队
  @observable token = isAuthenticated() // 当前用户token(获取cookie防止页面刷新会丢失)

  @action toggleLogin(flag, info = {}) {
    this.loginUser = info // 设置登录用户信息
    this.organizes = info.organizes // 设置登录用户加入团队信息
    if (flag) {
      authenticateSuccess(info.token)
      this.token = info.token // 设置登录用户token
      this.isLogin = true
    } else {
      logout()
      this.token = ''
      this.isLogin = false
    }
  }
}

export default new UserInfoStore()
