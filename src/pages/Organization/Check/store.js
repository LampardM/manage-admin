/**
 * @Desc In User Settings Edit
 * @exports class
 * @Author jieq
 * @Date 2020-04-18 10:47:22
 * @LastEditors jieq
 * @LastEditTime 2020-04-18 15:50:08
 */
import { observable, action } from 'mobx'

class OrganizationCheckStore {
  //搜索集合
  @observable filter = {}
  //表格数据
  @observable data = []
  //分页数据
  @observable pagination = {}

  @observable isTableLoading = false

  @action fetchTableData() {
    this.isTableLoading = true
    setTimeout(() => {
      this.isTableLoading = false
    }, 2000)
  }
}

export default new OrganizationCheckStore()
