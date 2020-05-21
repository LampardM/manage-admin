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
  initfilters = {
    contact: '',
    maxsubmittime: '',
    minsubmittime: '',
    orgname: '',
    orgtypecode: undefined,
    phone: '',
    submittername: ''
  }

  @observable
  filters = this.initfilters

  @action setfilters(value) {
    this.filters = value
  }

  @action clearfilters() {
    this.filters = this.initfilters
  }
}

export default new OrganizationCheckStore()
