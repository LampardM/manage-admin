/*
 * @Description: 左侧导航 map
 * @Author: jieq
 * @Date: 2020-04-16 21:31:20
 * @LastEditors: jieq
 * @LastEditTime: 2020-04-17 00:02:11
 */
const menus = [
  {
    title: '首页',
    key: '/home'
  },
  {
    title: '团队审核',
    key: '/organization',
    subs: [
      {
        title: '待审核',
        key: '/organization/check'
      },
      {
        title: '待授权',
        key: '/organization/auth'
      },
      {
        title: '已通过',
        key: '/organization/approve'
      },
      {
        title: '已驳回',
        key: '/organization/reject'
      }
    ]
  },
  {
    title: '团队管理',
    key: '/team',
    subs: [
      {
        title: '组织架构',
        key: '/team/architecture'
      },
      {
        title: '成员管理',
        key: '/team/member'
      },
      {
        title: '角色管理',
        key: '/team/character'
      }
    ]
  },
  {
    title: '终端管理',
    key: '/terminal',
    subs: [
      {
        title: '协议设置',
        key: '/terminal/agreement'
      },
      {
        title: '在线设备',
        key: '/terminal/online'
      },
      {
        title: '全部设备',
        key: '/terminal/devices'
      }
    ]
  }
]

export default menus
