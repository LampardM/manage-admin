/*
 * @Description: 成员管理store
 * @Author: longzhang6
 * @Date: 2020-06-27 14:02:57
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-06-27 14:03:45
 */
import { action, observable } from 'mobx'

class MemberStore {
  @observable
  initFilters = {
    phone: '',
    contact: '',
    orgName: '',
    orgTypeCode: '',
    maxSubmitTime: '',
    minSubmitTime: '',
    submitterName: ''
  }

  @observable
  filters = this.initFilters

  @action setFilters(value) {
    this.filters = value
  }

  @action clearFilters() {
    this.filters = this.initFilters
  }
}

export default new MemberStore()
