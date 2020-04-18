/**
 * @Desc In User Settings Edit
 * @exports class
 * @Author jieq
 * @Date 2020-04-18 10:41:52
 * @LastEditors jieq
 * @LastEditTime 2020-04-18 15:35:06
 */
/** official */
import React, { useState, useEffect } from 'react'
import { observer } from 'mobx-react'

/** vendor */
import { Row, Col, Button, Table } from 'antd'

//表头
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: true,
    render: name => `${name.first} ${name.last}`,
    width: '20%'
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    filters: [
      { text: 'Male', value: 'male' },
      { text: 'Female', value: 'female' }
    ],
    width: '20%'
  },
  {
    title: 'Email',
    dataIndex: 'email'
  }
]

const TableData = ({ data, pagination, isTableLoading, fetch }) => {
  useEffect(() => {
    fetch()
  })

  const approve = () => {}

  const reject = () => {}

  const handleTableChange = () => {}

  const optArea = () => (
    <>
      <Button type="primary" onClick={approve}>
        通过
      </Button>
      <Button
        style={{
          margin: '0 4px'
        }}
        onClick={reject}>
        驳回
      </Button>
    </>
  )

  return (
    <>
      <Row>
        <Col>{optArea()}</Col>
      </Row>

      <Table
        style={{ marginTop: 24 }}
        columns={columns}
        rowKey={record => record.login.uuid}
        dataSource={data}
        pagination={pagination}
        loading={isTableLoading}
        onChange={handleTableChange}
      />
    </>
  )
}

export default observer(TableData)
