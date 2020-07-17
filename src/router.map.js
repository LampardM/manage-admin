/**
 * @Desc 左侧nav数据
 * @exports class
 * @Author jieq
 * @Date 2020-04-16 21:31:20
 * @LastEditors jieq
 * @LastEditTime 2020-04-26 22:22:42
 */
const menus = [
  {
    title: '首页',
    key: '/home',
    show: true,
    unsub: true, // 不渲染下面的subs
    subs: [
      {
        title: '通知详情',
        key: '/home/notice'
      }
    ]
  },
  {
    title: '团队审核',
    key: '/organization',
    show: false,
    subs: [
      {
        title: '待审核',
        key: '/organization/check',
        show: false
      },
      {
        title: '待授权',
        key: '/organization/auth',
        show: false,
        unsub: true, // 不渲染下面的subs
        subs: [
          {
            title: '权限授权',
            key: '/organization/auth/info',
            show: false
          }
        ]
      },
      {
        title: '已通过',
        key: '/organization/approve',
        show: false,
        unsub: true, //  不渲染下面的subs
        subs: [
          {
            title: '编辑',
            key: '/organization/approve/edit',
            show: false
          }
        ]
      },
      {
        title: '已驳回',
        key: '/organization/reject',
        show: false
      }
    ]
  },
  {
    title: '团队管理',
    key: '/team',
    show: false,
    subs: [
      {
        title: '组织架构',
        key: '/team/architecture',
        show: false
      },
      {
        title: '成员管理',
        key: '/team/member',
        show: false,
        unsub: true, // 不渲染下面的subs
        subs: [
          {
            title: '添加成员',
            key: '/team/member/addmember',
            show: false
          },
          {
            title: '编辑成员',
            key: '/team/member/editmember',
            show: false
          }
        ]
      },
      {
        title: '角色管理',
        key: '/team/character',
        show: false,
        unsub: true, // 不渲染下面的subs
        subs: [
          {
            title: '添加角色',
            key: '/team/character/add',
            show: false
          },
          {
            title: '编辑角色',
            key: '/team/character/edit',
            show: false
          }
        ]
      }
    ]
  },
  // {
  //   title: '终端管理',
  //   key: '/terminal',
  //   subs: [
  //     {
  //       title: '协议设置',
  //       key: '/terminal/agreement'
  //     },
  //     {
  //       title: '在线设备',
  //       key: '/terminal/online'
  //     },
  //     {
  //       title: '全部设备',
  //       key: '/terminal/devices'
  //     }
  //   ]
  // },
  {
    title: '创建团队',
    key: '/create',
    show: true
  },
  {
    title: '团队设置',
    key: '/setting',
    show: true
  }
]

const blackList = [
  '/home/notice',
  '/team/character/add',
  '/team/character/edit',
  '/team/member/addmember',
  '/team/member/editmember',
  '/organization/auth/info',
  '/organization/approve/edit'
]

const navMap = {
  yj2g0LWOwR: '/organization',
  yj2ga1inpl: '/organization/check',
  yj2gZ2416f: '/organization/auth',
  yj2gLKiY2z: '/organization/approve',
  yj2gvTbsWj: '/organization/reject',
  yj2gjg2yAa: '/team',
  y63mb3GIQm: '/team/architecture',
  yj2gmxpbDx: '/team/member',
  yj2PdITv0L: '/team/character'
}

export { blackList }
export { navMap }

export default menus
