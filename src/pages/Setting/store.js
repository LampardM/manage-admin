/*
 * @Description: 团队设置store
 * @Author: longzhang6
 * @Date: 2020-07-08 22:50:39
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-07-08 22:51:55
 */
import { action, observable } from 'mobx'

class SettingStore {
  @observable
  transCode = ''

  @action setTranscode(value) {
    this.transCode = value
  }
}

export default new SettingStore()
