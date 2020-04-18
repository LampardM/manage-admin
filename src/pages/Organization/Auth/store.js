/**
 * @Desc In User Settings Edit
 * @exports class
 * @Author jieq
 * @Date 2020-04-18 10:47:22
 * @LastEditors jieq
 * @LastEditTime 2020-04-18 23:59:36
 */
import { action, observable } from 'mobx'

class OrganizationAuthStore {
  //分页数据
  @observable
  filters = {}

  @action setFilters(value) {
    this.filters = value
  }
}

export default new OrganizationAuthStore()
