/**
 * @Desc In User Settings Edit
 * @exports class
 * @Author jieq
 * @Date 2020-04-18 10:47:22
 * @LastEditors jieq
 * @LastEditTime 2020-04-26 00:26:18
 */
import { action, observable } from 'mobx'

class OrganizationApproveStore {
  @observable
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

export default new OrganizationApproveStore()
