/*
 * @Description: 成员管理table
 * @Author: longzhang6
 * @Date: 2020-04-19 19:11:00
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-26 09:05:00
 */
import { observer } from 'mobx-react'
import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { Table, Dropdown, Menu, Space } from 'antd'
import { DownOutlined } from '@ant-design/icons'

//表头
const columns = [
  {
    title: '姓名',
    dataIndex: 'memname',
    ellipsis: true,
    textWrap: 'word-break'
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    ellipsis: true,
    textWrap: 'word-break'
  },
  {
    title: '角色',
    dataIndex: 'character',
    ellipsis: true,
    textWrap: 'word-break'
  },
  {
    title: '所属部门',
    dataIndex: 'department',
    ellipsis: true,
    textWrap: 'word-break'
  }
]

const joinMenuHandler = (record, item, key) => {}

const joinedMenu = record => {
  return (
    <Menu onClick={(item, key) => joinMenuHandler(record, item, key)}>
      <Menu.Item key="1">详情</Menu.Item>
      <Menu.Item key="2">删除</Menu.Item>
    </Menu>
  )
}

const invitedMenu = record => {
  return (
    <Menu onClick={(item, key) => joinMenuHandler(record, item, key)}>
      <Menu.Item key="1">复制链接</Menu.Item>
      <Menu.Item key="2">取消邀请</Menu.Item>
    </Menu>
  )
}

const joinedAction = record => {
  return (
    <Space>
      <span style={{ color: '#1890ff' }}>编辑</span>
      <Dropdown overlay={() => joinedMenu(record)}>
        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
          更多
          <DownOutlined />
        </a>
      </Dropdown>
    </Space>
  )
}

const invitedAction = record => {
  return (
    <Space>
      <span style={{ color: '#1890ff' }}>再邀请</span>
      <Dropdown overlay={() => invitedMenu(record)}>
        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
          更多
          <DownOutlined />
        </a>
      </Dropdown>
    </Space>
  )
}

const MemberTable = props => {
  const { curselect } = props
  const [data, setData] = useState([
    {
      key: '1',
      memname: '胡彦斌',
      phone: 18356032765,
      character: 32,
      department: '西湖区湖底公园1号'
    },
    {
      key: '2',
      memname: '胡彦祖',
      phone: 18356032765,
      character: 32,
      department: '西湖区湖底公园1号'
    }
  ])
  const [pagination, setPagination] = useState({})
  const [isTableLoading, setIsTableLoading] = useState(false)

  const handleTableChange = () => {}

  useEffect(() => {
    console.log(curselect, 'curselect')
    // TODO 更新列表
  }, [curselect])

  return (
    <TableContainer>
      <Table
        style={{ marginTop: 0 }}
        columns={columns.concat({
          title: '操作',
          dataIndex: 'action',
          width: 260,
          render: (_, item) => {
            if (curselect === 'joined') {
              return joinedAction(item)
            } else {
              return invitedAction(item)
            }
          }
        })}
        rowKey={(row, idx, self) => {
          return row.key
        }}
        dataSource={data}
        pagination={pagination}
        loading={isTableLoading}
        onChange={handleTableChange}
        rowSelection={{
          onChange: (selectedKeys, selectedItems) => {
            console.log(`selectedRowKeys: ${selectedKeys}`, 'selectedRows: ', selectedItems)
          }
        }}
      />
    </TableContainer>
  )
}

const TableContainer = styled.div``

export default MemberTable
