/*
 * @Description: mobx状态管理入口
 * @Author: longzhang6
 * @Date: 2020-04-11 15:57:26
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-07-08 22:57:02
 */
/** global */
import userInfoStore from './userInfoStore'

/** partial */
import TeamCharacterStore from '../pages/Team/Character/store'
import OrganizationAuthStore from '../pages/Organization/Auth/store'
import OrganizationCheckStore from '../pages/Organization/Check/store'
import OrganizationRejectStore from '../pages/Organization/Reject/store'
import OrganizationApproveStore from '../pages/Organization/Approve/store'
import DepartMentStore from '../pages/Team/Architecture/store'
import SettingStore from '../pages/Setting/store'

const store = {
  userInfoStore,
  TeamCharacterStore,
  OrganizationAuthStore,
  OrganizationCheckStore,
  OrganizationRejectStore,
  OrganizationApproveStore,
  DepartMentStore,
  SettingStore
}

export { store }
