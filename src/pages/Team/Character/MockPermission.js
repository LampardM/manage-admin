export const Permissions = [
  {
    key: 'organization',
    value: '团队审核',
    subs: [
      {
        key: 'organization_check',
        value: '待审核',
        subs: [
          {
            key: 'organization_check_view',
            value: '查看'
          },
          {
            key: 'organization_check_check',
            value: '审核'
          }
        ]
      },
      {
        key: 'organization_auth',
        value: '待授权',
        subs: [
          {
            key: 'organization_auth_view',
            value: '查看'
          },
          {
            key: 'organization_auth_auth',
            value: '授权'
          }
        ]
      },
      {
        key: 'organization_approve',
        value: '已通过',
        subs: [
          {
            key: 'organization_approve_view',
            value: '查看'
          },
          {
            key: 'organization_approve_onOff',
            value: '启用/禁用'
          },
          {
            key: 'organization_approve_edit',
            value: '编辑'
          }
        ]
      },
      {
        key: 'organization_reject',
        value: '未通过',
        subs: [
          {
            key: 'organization_reject_view',
            value: '查看'
          },
          {
            key: 'organization_reject_delete',
            value: '删除'
          }
        ]
      }
    ]
  },
  {
    key: 'team',
    value: '团队管理',
    subs: [
      {
        key: 'team_architecture',
        value: '组织架构',
        subs: [
          {
            key: 'team_architecture_view',
            value: '查看'
          },
          {
            key: 'team_architecture_addDepartment',
            value: '添加部门'
          },
          {
            key: 'team_architecture_edit',
            value: '编辑'
          },
          {
            key: 'team_architecture_delete',
            value: '删除'
          }
        ]
      },
      {
        key: 'team_member',
        value: '成员管理',
        subs: [
          {
            key: 'team_member_view',
            value: '查看'
          },
          {
            key: 'team_member_addmember',
            value: '添加成员'
          },
          {
            key: 'team_member_edit',
            value: '编辑'
          },
          {
            key: 'team_member_delete',
            value: '删除'
          }
        ]
      },
      {
        key: 'team_character',
        value: '角色管理',
        subs: [
          {
            key: 'team_character_view',
            value: '查看'
          },
          {
            key: 'team_character_addCharacter',
            value: '添加角色'
          },
          {
            key: 'team_character_onOff',
            value: '启用/禁用'
          },
          {
            key: 'team_character_edit',
            value: '编辑'
          }
        ]
      }
    ]
  },
  {
    key: 'terminal',
    value: 'IOT设备管理',
    subs: [
      {
        key: 'terminal_agreement',
        value: '协议设置',
        subs: [
          {
            key: 'terminal_agreement_view',
            value: '查看'
          },
          {
            key: 'terminal_agreement_modify',
            value: '修改'
          }
        ]
      },
      {
        key: 'terminal_online',
        value: '在线设备',
        subs: [
          {
            key: 'terminal_online_view',
            value: '查看'
          },
          {
            key: 'terminal_online_off',
            value: '断开'
          }
        ]
      },
      {
        key: 'terminal_devices',
        value: '全部设备',
        subs: [
          {
            key: 'terminal_devices_view',
            value: '查看'
          },
          {
            key: 'terminal_devices_add',
            value: '添加'
          },
          {
            key: 'terminal_devices_delete',
            value: '删除'
          }
        ]
      }
    ]
  }
]

export const AuthorisedPermissions = [
  {
    key: 'organization',
    value: '团队审核',
    subs: [
      {
        key: 'organization_check',
        value: '待审核'
      },
      {
        key: 'organization_auth',
        value: '待授权'
      },
      {
        key: 'organization_approve',
        value: '已通过'
      },
      {
        key: 'organization_reject',
        value: '未通过'
      }
    ]
  },
  {
    key: 'team',
    value: '团队管理',
    subs: [
      {
        key: 'team_architecture',
        value: '组织架构'
      },
      {
        key: 'team_member',
        value: '成员管理'
      },
      {
        key: 'team_character',
        value: '角色管理'
      }
    ]
  },
  {
    key: 'terminal',
    value: 'IOT设备管理',
    subs: [
      {
        key: 'terminal_agreement',
        value: '协议设置'
      },
      {
        key: 'terminal_online',
        value: '在线设备'
      },
      {
        key: 'terminal_devices',
        value: '全部设备'
      }
    ]
  }
]
