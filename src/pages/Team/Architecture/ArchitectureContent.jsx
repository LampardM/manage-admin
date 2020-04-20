/*
 * @Description: 组织架构内容
 * @Author: longzhang6
 * @Date: 2020-04-18 15:46:55
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-20 22:04:39
 */
import React, { useState, useEffect } from 'react'
import { Button, Modal, Form, Input, Cascader } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import ArchitectureModal from './ArchitectureModal'
import { Tree } from 'element-react'
import { observer } from 'mobx-react'
import styled from 'styled-components'

const { confirm, warning } = Modal

const treeData = [
  {
    id: 1,
    label: '一级 1',
    children: [
      {
        id: 4,
        label: '二级 1-1',
        children: [
          {
            id: 9,
            label: '三级 1-1-1'
          },
          {
            id: 10,
            label: '三级 1-1-2'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    label: '一级 2',
    children: [
      {
        id: 5,
        label: '二级 2-1'
      },
      {
        id: 6,
        label: '二级 2-2'
      }
    ]
  },
  {
    id: 3,
    label: '一级 3',
    children: [
      {
        id: 7,
        label: '二级 3-1'
      },
      {
        id: 8,
        label: '二级 3-2'
      }
    ]
  }
]

const options = {
  children: 'children',
  label: 'label'
}

const ArchitectureContent = () => {
  const [defaultAllExpand, setDefaultAllExpand] = useState(true)
  const [recursionResult, setRecursionResult] = useState([])
  const [reLoadTree, setReLoadTree] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  const [modalType, setModalType] = useState('create')
  const [subInfo, setSubInfo] = useState({})

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
    setRecursionResult(treeData)
  })

  // TODO 后期补全
  const openOrCloseAllNode = () => {
    setDefaultAllExpand(!defaultAllExpand)
    setReLoadTree(!reLoadTree)
  }

  const onNodeClicked = (nodeModel, node) => {
    // nodeModel = true
  }

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
  const deleteCurDepartment = () => {
    console.log('editCurDepartment')
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

  // Tree自定义内容
  const renderContent = (nodeModel, data, store) => {
    return (
      <span>
        <span>
          <span>{data.label}</span>
        </span>
        <span style={{ float: 'right', marginRight: '20px' }}>
          <span
            size="mini"
            onClick={() => addChildDepartment(store, data, nodeModel)}
            style={{ padding: '5px', color: '#1890ff' }}
          >
            添加子部门
          </span>
          <span
            size="mini"
            onClick={() => editCurDepartment(store, data, nodeModel)}
            style={{ padding: '5px', color: '#1890ff' }}
          >
            编辑
          </span>
          <span
            size="mini"
            onClick={() => deleteCurDepartment(store, data, nodeModel)}
            style={{ padding: '5px', color: '#1890ff' }}
          >
            删除
          </span>
        </span>
      </span>
    )
  }

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
        <Tree
          style={{ border: 'none' }}
          data={recursionResult}
          options={options}
          nodeKey="id"
          defaultExpandAll={defaultAllExpand}
          expandOnClickNode={false}
          onNodeClicked={onNodeClicked}
          renderContent={(...args) => renderContent(...args)}
        />
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
  justify-content: space-between;
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
