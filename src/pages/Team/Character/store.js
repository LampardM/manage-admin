/**
 * @Desc In User Settings Edit
 * @exports class
 * @Author jieq
 * @Date 2020-04-26 22:07:53
 * @LastEditors jieq
 * @LastEditTime 2020-04-26 22:07:53
 */

import { action, observable } from 'mobx'

class TeamCharacterStore {
  @observable
  initFilters = {
    name: '',
    status: undefined
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

export default new TeamCharacterStore()
