/**
 * @Desc In User Settings Edit
 * @exports class
 * @Author jieq
 * @Date 2020-04-19 15:38:09
 * @LastEditors jieq
 * @LastEditTime 2020-04-21 01:21:02
 */
/** official */
import { observer } from 'mobx-react'
import styled from 'styled-components'
import React, { useState, useEffect } from 'react'

/** vendor */
import { Table, Checkbox } from 'antd'

/** custom */
import { useStore } from '@/hooks/useStore'

const allNode = [
  'managementFunction', //管理功能
  'teamManagement', //团队管理
  'IOTDeviceManagement', //IOT设备管理
  'organizationalStructure', //组织架构
  'memberManagement', //成员管理
  'characterManagement', //角色管理
  'agreementSetting', //协议设置
  'onlineDevices', //在线设备
  'allDevices' //全部设备
]

const _allNode = {
  key: 'managementFunction',
  value: '管理功能',
  sub: [
    {
      key: 'teamManagement',
      value: '团队管理',
      sub: [
        {
          key: 'organizationalStructure',
          value: '组织架构'
        },
        {
          key: 'memberManagement',
          value: '成员管理'
        },
        {
          key: 'characterManagement',
          value: '角色管理'
        }
      ]
    },
    {
      key: 'IOTDeviceManagement',
      value: 'IOT设备管理',
      sub: [
        {
          key: 'agreementSetting',
          value: '协议设置'
        },
        {
          key: 'onlineDevices',
          value: '在线设备'
        },
        {
          key: 'allDevices',
          value: '全部设备'
        }
      ]
    }
  ]
}

const Privilege = ({ className }) => {
  const [tableData, setTableData] = useState([])
  const [checkedList, setCheckedList] = useState([])
  const [isTableLoading, setIsTableLoading] = useState(true)

  useEffect(() => {
    fetch()
  }, [])

  const fetch = () => {
    setTimeout(() => {
      setTableData([
        {
          key: '1',
          function: 'John Brown',
          first: 32,
          second: '0571-22098909'
        },
        {
          key: '2',
          function: 'Jim Green',
          second: '0571-22098333',
          first: 42
        }
      ])
      setIsTableLoading(false)
    }, 1000)
  }

  const renderCheckboxItem = (text, record, index) => {
    return (
      <Checkbox value={text} onChange={onItemChange}>
        {text}
      </Checkbox>
    )
  }

  const onAllChange = ({ target }) => {
    console.log('onAllChange', target.checked)
    if (target.checked) {
    } else {
    }
  }

  const onItemChange = checkedList => {
    console.log('checkedList', checkedList)
  }

  return (
    <div className={className}>
      <Checkbox onChange={onAllChange}>全选</Checkbox>

      <Table
        bordered
        className="table"
        dataSource={tableData}
        loading={isTableLoading}
        columns={[
          {
            title: '功能分类',
            dataIndex: 'function',
            render: (value, row, index) => {
              const obj = {
                children: renderCheckboxItem(value),
                props: {}
              }
              if (index === 0) {
                obj.props.rowSpan = 2
              }
              // These two are merged into above cell
              if (index === 1) {
                obj.props.rowSpan = 0
              }
              return obj
            }
          },
          {
            title: '一级菜单',
            dataIndex: 'first',
            render: renderCheckboxItem
          },
          {
            title: '二级菜单',
            colSpan: 2,
            dataIndex: 'second',
            render: renderCheckboxItem
          }
        ]}
      />
    </div>
  )
}

export default observer(styled(Privilege)`
  padding-top: 20px;

  .table {
    margin-top: 20px;
  }
`)
