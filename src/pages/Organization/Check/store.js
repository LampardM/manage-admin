/**
 * @Desc store
 * @exports class
 * @Author jieq
 * @Date 2020-04-18 10:47:22
 * @LastEditors jieq
 * @LastEditTime 2020-04-26 00:25:32
 */
import { toJS, action, observable } from 'mobx'

class OrganizationCheckStore {
  initFilters = {}

  @observable
  filters = {}

  @action setFilters(value) {
    this.filters = value
  }

  @action clearFilters() {
    this.filters = this.initFilters
  }
}

export default new OrganizationCheckStore()
