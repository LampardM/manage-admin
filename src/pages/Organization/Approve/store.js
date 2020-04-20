/**
 * @Desc In User Settings Edit
 * @exports class
 * @Author jieq
 * @Date 2020-04-18 10:47:22
 * @LastEditors jieq
 * @LastEditTime 2020-04-20 23:20:30
 */
import { action, observable } from 'mobx'

class OrganizationApproveStore {
  //分页数据
  @observable
  filters = {}

  @action setFilters(value) {
    this.filters = value
  }
}

export default new OrganizationApproveStore()
