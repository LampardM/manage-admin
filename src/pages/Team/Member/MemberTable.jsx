/*
 * @Description: 成员管理table
 * @Author: longzhang6
 * @Date: 2020-04-19 19:11:00
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-19 19:29:50
 */
import { observer } from 'mobx-react'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Table } from 'antd'

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

const MemberTable = () => {
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({})
  const [isTableLoading, setIsTableLoading] = useState(false)

  const handleTableChange = () => {}

  return (
    <TableContainer>
      <Table
        style={{ marginTop: 0 }}
        columns={columns.concat({
          title: '操作',
          dataIndex: 'action',
          width: 65,
          render: (_, item) => {
            return <a href="js:void()">编辑</a>
          }
        })}
        rowKey={(row, idx, self) => {
          return row.cell
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
