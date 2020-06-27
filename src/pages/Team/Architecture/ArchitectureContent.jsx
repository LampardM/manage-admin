/*
 * @Description: 组织架构内容
 * @Author: longzhang6
 * @Date: 2020-04-18 15:46:55
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-06-27 14:29:18
 */
import React, { useState, useEffect } from 'react'
import { Button, Modal, Form, Input, Cascader, Table, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import ArchitectureModal from './ArchitectureModal'
import { observer } from 'mobx-react'
import { useStore } from '@/hooks/useStore'
import { createDepartment, getCurDepartment } from '@/api/department'

import styled from 'styled-components'

const { confirm, warning } = Modal
const { Column, ColumnGroup } = Table

const data = [
  {
    key: 1,
    name: '1',
    age: 60,
    address: 'New York No. 1 Lake Park',
    children: [
      {
        key: 11,
        name: '1.1',
        age: 42,
        address: 'New York No. 2 Lake Park'
      },
      {
        key: 12,
        name: '1.2',
        age: 30,
        address: 'New York No. 3 Lake Park',
        children: [
          {
            key: 121,
            name: '2.1',
            age: 16,
            address: 'New York No. 3 Lake Park'
          }
        ]
      },
      {
        key: 13,
        name: '1.3',
        age: 72,
        address: 'London No. 1 Lake Park',
        children: [
          {
            key: 131,
            name: '2.2',
            age: 42,
            address: 'London No. 2 Lake Park',
            children: [
              {
                key: 1311,
                name: '3.1',
                age: 25,
                address: 'London No. 3 Lake Park'
              },
              {
                key: 1312,
                name: '3.2',
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
    name: '2',
    age: 32,
    address: 'Sidney No. 1 Lake Park'
  }
]

const ArchitectureContent = () => {
  const { userInfoStore } = useStore()
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
    let _params = {
      param: {
        baseDepartmentCode: '',
        buildChild: false,
        excludeCode: [],
        totalNodeLevel: 6
      },
      timestamp: JSON.stringify(new Date().getTime()),
      token: userInfoStore.token,
      version: userInfoStore.version
    }

    getCurDepartment(_params)
      .then(_result => {
        console.log(_result)
        setRecursionResult(_result.data)
      })
      .catch(err => console.log(err))
  }, [])

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

  const modalHandleOk = values => {
    let _params = {
      param: {
        departmentName: values.department,
        parentCode: '' // 创建顶级部门传空字符串
      },
      timestamp: JSON.stringify(new Date().getTime()),
      token: userInfoStore.token,
      version: userInfoStore.version
    }
    createDepartment(_params)
      .then(_result => {
        console.log(_result)
        message.success('创建部门成功')
      })
      .catch(err => {
        console.log(err)
      })
    setModalShow(false)
  }

  const modalHandleCancel = () => {
    setModalShow(false)
  }

  // * 递归查同级节点
  const findSameLevelNode = (data, departmentCode) => {
    let result
    if (!data) {
      return
    }
    for (var i = 0; i < data.length; i++) {
      let item = data[i]
      if (item.departmentCode === departmentCode) {
        result = data
        return result
      } else if (item.children && item.children.length > 0) {
        result = findSameLevelNode(item.children, departmentCode)
        if (result) {
          return result
        }
      }
    }
    return result
  }

  const onExpand = (expanded, record) => {
    let cloneExpandedRowKeys = [...expandedRowKeys]
    const sameLevelNode = findSameLevelNode(recursionResult, record.departmentCode)
    const siblingNodeKey = sameLevelNode.reduce((acc, cur, curIdx) => {
      if (cur.departmentCode !== record.departmentCode) {
        acc.push(cur.departmentCode)
      }
      return acc
    }, [])

    if (expanded) {
      cloneExpandedRowKeys = cloneExpandedRowKeys.filter(
        departmentCode => !siblingNodeKey.includes(departmentCode)
      )
      cloneExpandedRowKeys.push(record.departmentCode)
    } else {
      const curIdx = cloneExpandedRowKeys.findIndex(
        departmentCode => departmentCode === record.departmentCode
      )
      cloneExpandedRowKeys.splice(curIdx, 1)
    }

    setExpandedRowKeys(cloneExpandedRowKeys)
  }

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
          rowKey="departmentCode"
          showHeader={false}
          dataSource={recursionResult}
          onExpand={onExpand}
          rowExpandable={rowExpandable}
          expandedRowKeys={expandedRowKeys}
        >
          <Column title="departmentName" dataIndex="departmentName" key="departmentName" />
          <Column
            title="Action"
            key="action"
            align="right"
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
