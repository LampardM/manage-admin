/**
 * @Desc In User Settings Edit
 * @exports class
 * @Author jieq
 * @Date 2020-04-16 21:31:20
 * @LastEditors jieq
 * @LastEditTime 2020-04-21 00:46:18
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
        key: '/organization/auth',
        unsub: true, // FIXME 不渲染下面的subs
        subs: [
          {
            title: '权限授权',
            key: '/organization/auth/info'
          }
        ]
      },
      {
        title: '已通过',
        key: '/organization/approve',
        unsub: true, // FIXME 不渲染下面的subs
        subs: [
          {
            title: '编辑',
            key: '/organization/approve/edit'
          }
        ]
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
        key: '/team/member',
        unsub: true, // FIXME 不渲染下面的subs
        subs: [
          {
            title: '添加成员',
            key: '/team/member/addmember'
          },
          {
            title: '编辑成员',
            key: '/team/member/editmember'
          }
        ]
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

// FIXME 不推荐这么做
const blackList = [
  '/team/member/addmember',
  '/organization/auth/info',
  '/organization/approve/edit'
]

export { blackList }

export default menus
