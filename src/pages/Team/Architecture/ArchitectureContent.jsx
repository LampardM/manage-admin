/*
 * @Description: 组织架构内容
 * @Author: longzhang6
 * @Date: 2020-04-18 15:46:55
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-22 23:02:27
 */
import React, { useState, useEffect } from 'react'
import { Button, Modal, Form, Input, Cascader, Table } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import ArchitectureModal from './ArchitectureModal'
import { observer } from 'mobx-react'
import styled from 'styled-components'

const { confirm, warning } = Modal
const { Column, ColumnGroup } = Table

const data = [
  {
    key: 1,
    name: 'John Brown sr.',
    age: 60,
    address: 'New York No. 1 Lake Park',
    children: [
      {
        key: 11,
        name: 'John Brown',
        age: 42,
        address: 'New York No. 2 Lake Park'
      },
      {
        key: 12,
        name: 'John Brown jr.',
        age: 30,
        address: 'New York No. 3 Lake Park',
        children: [
          {
            key: 121,
            name: 'Jimmy Brown',
            age: 16,
            address: 'New York No. 3 Lake Park'
          }
        ]
      },
      {
        key: 13,
        name: 'Jim Green sr.',
        age: 72,
        address: 'London No. 1 Lake Park',
        children: [
          {
            key: 131,
            name: 'Jim Green',
            age: 42,
            address: 'London No. 2 Lake Park',
            children: [
              {
                key: 1311,
                name: 'Jim Green jr.',
                age: 25,
                address: 'London No. 3 Lake Park'
              },
              {
                key: 1312,
                name: 'Jimmy Green sr.',
                age: 18,
                address: 'London No. 4 Lake Park'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    key: 2,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park'
  }
]

const ArchitectureContent = () => {
  const [recursionResult, setRecursionResult] = useState([])
  const [modalShow, setModalShow] = useState(false)
  const [modalType, setModalType] = useState('create')
  const [subInfo, setSubInfo] = useState({})
  const [expandedRowKeys, setExpandedRowKeys] = useState([])

  const recursionExpandKeys = (arr, result) => {
    arr.forEach(element => {
      let exitIdx = result.findIndex(key => key === element.key)
      if (exitIdx === -1) {
        result.push(element.key)
      }

      if (element.children) {
        recursionExpandKeys(element.children, result)
      }
    })
    return result
  }

  useEffect(() => {
    setRecursionResult(data)
  })

  // 添加子部门
  const addChildDepartment = (store, data, nodeModel) => {
    console.log('data', data)
    console.log('nodeModel', nodeModel)
    setSubInfo(data)
    setModalShow(true)
  }

  // 编辑部门
  const editCurDepartment = () => {
    setModalType('edit')
    setModalShow(true)
  }

  // 删除部门
  const deleteCurDepartment = record => {
    console.log('deleteCurDepartment', record)
    // TODO 查询信息

    // warning({
    //   title: 'This is a warning message',
    //   content: 'some messages...some messages...'
    // })

    confirm({
      title: 'Do you Want to delete these items?',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger',
      content: 'Some descriptions',
      onOk() {
        console.log('OK')
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  // 添加部门
  const addDepartment = () => {
    setSubInfo({})
    setModalShow(true)
  }

  const modalHandleOk = () => {
    setModalShow(false)
  }

  const modalHandleCancel = () => {
    setModalShow(false)
  }

  const onExpandedRowsChange = expandedRows => {
    console.log(expandedRows, 'expandedRows')
    setExpandedRowKeys(expandedRows)
  }

  const onExpand = (expanded, record) => {}

  const rowExpandable = record => {}

  return (
    <ArchitectureContainer>
      <ArchitectureModal
        modalShow={modalShow}
        modalType={modalType}
        subInfo={subInfo}
        onCancel={modalHandleCancel}
        onCreate={modalHandleOk}
      />
      <ArchitectureTitle>
        <Button type="primary" onClick={addDepartment}>
          添加部门
        </Button>
      </ArchitectureTitle>
      <ArchitectureMain>
        <Table
          showHeader={false}
          dataSource={recursionResult}
          onExpandedRowsChange={onExpandedRowsChange}
          onExpand={onExpand}
          rowExpandable={rowExpandable}
          expandedRowKeys={expandedRowKeys}
        >
          <Column title="Name" dataIndex="name" key="name" />
          <Column title="Age" dataIndex="age" key="age" />
          <Column title="Address" dataIndex="address" key="address" />
          <Column
            title="Action"
            key="action"
            render={(text, record) => (
              <span>
                <a style={{ marginRight: 16 }}>Invite {record.lastName}</a>
                <a onClick={() => deleteCurDepartment(record)}>Delete</a>
              </span>
            )}
          />
        </Table>
      </ArchitectureMain>
    </ArchitectureContainer>
  )
}

const ArchitectureContainer = styled.div`
  margin: 16px;
  background: #fff;
`

const ArchitectureTitle = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
`

const OpenAll = styled.span`
  cursor: pointer;
`

const ArchitectureMain = styled.div`
  padding: 10px;
`

export default observer(ArchitectureContent)
