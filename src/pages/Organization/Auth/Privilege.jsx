/**
 * @Desc table数据
 * @exports class
 * @Author jieq
 * @Date 2020-04-19 15:38:09
 * @LastEditors jieq
 * @LastEditTime 2020-05-10 01:42:07
 */
/** official */
import { observer } from 'mobx-react'
import styled from 'styled-components'
import React, { useState, useEffect } from 'react'

/** custom */
// import { useStore } from '@/hooks/useStore'

/** ui */
import { Checkbox } from 'antd'
import TableCheckBox from '../../../components/TableCheckBox'

// const allNode = [
//   'managementFunction', //管理功能
//   'teamManagement', //团队管理
//   'IOTDeviceManagement', //IOT设备管理
//   'organizationalStructure', //组织架构
//   'memberManagement', //成员管理
//   'characterManagement', //角色管理
//   'agreementSetting', //协议设置
//   'onlineDevices', //在线设备
//   'allDevices' //全部设备
// ]

const Privilege = ({ className }) => {
  const [tableData, setTableData] = useState([])
  // const [checkedList, setCheckedList] = useState([])
  const [isTableLoading, setIsTableLoading] = useState(true)

  useEffect(() => {
    fetch()
  }, [])

  const fetch = () => {
    setTimeout(() => {
      setTableData([
        {
          key: 'managementFunction',
          value: '管理功能',
          subs: [
            {
              key: 'teamManagement',
              value: '团队管理',
              checked: true,
              subs: [
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
              subs: [
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
                  value: '全部设备',
                  checked: true
                }
              ]
            }
          ]
        }
      ])
      setIsTableLoading(false)
    }, 1000)
  }

  return (
    <div className={className}>
      <TableCheckBox
        bordered
        className="table"
        pagination={false}
        showAllChecked={true}
        loading={isTableLoading}
        rowKey={(row, idx, self) => {
          // console.log('rowKey', row)
          return idx
        }}
        columns={[
          {
            title: '功能分类',
            dataIndex: 'function'
          },
          {
            title: '一级菜单',
            dataIndex: 'first'
          },
          {
            title: '二级菜单',
            dataIndex: 'second'
          }
        ]}
        nodeData={tableData}
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
