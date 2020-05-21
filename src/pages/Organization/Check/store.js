/**
 * @Desc store
 * @exports class
 * @Author jieq
 * @Date 2020-04-18 10:47:22
 * @LastEditors jieq
 * @LastEditTime 2020-04-26 00:25:32
 */
import { action, observable } from 'mobx'

class OrganizationCheckStore {
  initFilters = {
    contact: '',
    maxSubmitTime: '',
    minSubmitTime: '',
    orgName: '',
    orgTypeCode: undefined,
    phone: '',
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

export default new OrganizationCheckStore()
