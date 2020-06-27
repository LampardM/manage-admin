/*
 * @Description: 组织架构内容
 * @Author: longzhang6
 * @Date: 2020-04-18 15:46:55
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-06-27 18:29:32
 */
import React, { useState, useEffect } from 'react'
import { Button, Modal, Form, Input, Table, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import ArchitectureModal from './ArchitectureModal'
import { observer } from 'mobx-react'
import { useStore } from '@/hooks/useStore'
import {
  createDepartment,
  getCurDepartment,
  deleteDepartment,
  updateDepartment
} from '@/api/department'

import styled from 'styled-components'

const { confirm, warning } = Modal
const { Column } = Table

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

  const deleteUselessChildren = arr => {
    arr.forEach(_item => {
      if (_item.children && _item.children.length === 0) {
        delete _item.children
      } else {
        deleteUselessChildren(_item.children)
      }
    })
  }

  const getCurDepartmentList = () => {
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
        deleteUselessChildren(_result.data)
        setRecursionResult(_result.data)
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    getCurDepartmentList()
  }, [])

  // 添加子部门
  const addChildDepartment = parentInfo => {
    setSubInfo(parentInfo)
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
    let _params = {
      param: record.departmentCode,
      timestamp: JSON.stringify(new Date().getTime()),
      token: userInfoStore.token,
      version: userInfoStore.version
    }

    confirm({
      title: '确认删除？',
      icon: <ExclamationCircleOutlined />,
      content: '是否确认删除所选部门',
      onOk() {
        console.log('OK')
        deleteDepartment(_params)
          .then(_result => {
            message.success('删除部门成功')
            getCurDepartmentList()
          })
          .catch(err => {
            warning({
              title: '无法删除',
              content: err
            })
          })
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

  const modalHandleOk = (values, subInfo) => {
    let _params = {
      param: {
        departmentName: values.department,
        parentCode: subInfo.departmentCode ? subInfo.departmentCode : ''
      },
      timestamp: JSON.stringify(new Date().getTime()),
      token: userInfoStore.token,
      version: userInfoStore.version
    }
    createDepartment(_params)
      .then(_result => {
        console.log(_result)
        getCurDepartmentList()
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
                <a style={{ marginRight: 16 }} onClick={() => addChildDepartment(record)}>
                  添加子部门 {record.lastName}
                </a>
                <a style={{ marginRight: 16 }}>编辑 {record.lastName}</a>
                <a onClick={() => deleteCurDepartment(record)}>删除</a>
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
