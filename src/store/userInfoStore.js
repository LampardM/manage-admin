/*
 * @Description: 登录态store
 * @Author: longzhang6
 * @Date: 2020-04-11 16:08:12
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-07-14 00:35:33
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
  @observable organizes = localStorage.getItem('user-organizes') // 当前用户已加入团队(防止页面刷新数据丢失)
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
      this.organizes = []
      this.token = ''
      this.isLogin = false
    }
  }
}

export default new UserInfoStore()
