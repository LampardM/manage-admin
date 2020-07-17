/*
 * @Description: 组织架构内容
 * @Author: longzhang6
 * @Date: 2020-04-18 15:46:55
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-07-17 21:36:53
 */
import React, { useState, useEffect } from 'react'
import { Button, Modal, Table, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react'
import { useStore } from '@/hooks/useStore'
import { getCurDepart } from '@/utils/session'
import {
  createDepartment,
  getCurDepartment,
  deleteDepartment,
  updateDepartment
} from '@/api/department'
import ArchitectureModal from './ArchitectureModal'
import styled from 'styled-components'

const { confirm, warning } = Modal
const { Column } = Table

const ArchitectureContent = () => {
  const { userInfoStore } = useStore()
  const [recursionResult, setRecursionResult] = useState([])
  const [modalShow, setModalShow] = useState(false)
  const [modalType, setModalType] = useState('create')
  const [subInfo, setSubInfo] = useState('')
  const [curDepart, setCurDepart] = useState({})
  const [expandedRowKeys, setExpandedRowKeys] = useState([])
  const [isTableLoading, setIsTableLoading] = useState(false)
  const [drillingDown, setDrillingDown] = useState(false)
  const [baseCode, setBaseCode] = useState('')

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

  const countDepartLevel = (arr, level = 0) => {
    arr.forEach(_item => {
      _item.level = level
      if (_item.children) {
        countDepartLevel(_item.children, level + 1)
      }
    })
  }

  const getCurDepartmentList = () => {
    setIsTableLoading(true)
    let _params = {
      param: {
        baseDepartmentCode: baseCode,
        buildChild: drillingDown,
        excludeCode: [],
        totalNodeLevel: 6
      },
      timestamp: JSON.stringify(new Date().getTime()),
      token: userInfoStore.token,
      version: userInfoStore.version
    }

    getCurDepartment(_params)
      .then(_result => {
        setIsTableLoading(false)
        deleteUselessChildren(_result.data)
        countDepartLevel(_result.data)
        setRecursionResult(_result.data)
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    getCurDepartmentList()
  }, [drillingDown])

  const findParentDepartment = (targetArr, target, parent = getCurDepart()) => {
    let _targetCode
    for (let i = 0; i < targetArr.length; i++) {
      if (targetArr[i].departmentCode === target) {
        _targetCode = parent
        return _targetCode
      } else {
        if (targetArr[i].children && targetArr[i].children.length > 0) {
          _targetCode = findParentDepartment(
            targetArr[i].children,
            target,
            targetArr[i].departmentCode
          )
          if (_targetCode) return _targetCode
        }
      }
    }
    return _targetCode
  }

  // 添加子部门
  const addChildDepartment = curInfo => {
    setSubInfo(curInfo.departmentCode)
    setModalType('create')
    setModalShow(true)
  }

  // 编辑部门
  const editCurDepartment = curInfo => {
    let _subInfo =
      curInfo.departmentLevel === 1
        ? ''
        : findParentDepartment(recursionResult, curInfo.departmentCode)
    setSubInfo(_subInfo)
    setCurDepart(curInfo)
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
    setSubInfo('')
    setModalShow(true)
  }

  const modalHandleOk = (values, curInfo) => {
    let _params = {
      param: {
        departmentName: values.department,
        parentCode: values.updepartment !== getCurDepart() ? values.updepartment : ''
      },
      timestamp: JSON.stringify(new Date().getTime()),
      token: userInfoStore.token,
      version: userInfoStore.version
    }
    if (modalType === 'create') {
      createDepartment(_params)
        .then(_result => {
          console.log(_result)
          getCurDepartmentList()
          message.success('创建部门成功')
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      _params = Object.assign({}, _params, {
        param: {
          departmentCode: curInfo.departmentCode,
          departmentName: values.department,
          parentCode: values.updepartment !== getCurDepart() ? values.updepartment : ''
        }
      })
      updateDepartment(_params)
        .then(_result => {
          console.log(_result)
          getCurDepartmentList()
          message.success('更新部门成功')
        })
        .catch(err => {
          console.log(err)
        })
    }

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
    const siblingNodeKey = sameLevelNode.reduce((acc, cur) => {
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

  const getMoreChildren = record => {
    setDrillingDown(true)
    setBaseCode(record.departmentCode)
  }

  const getMoreParent = record => {
    setDrillingDown(false)
    setBaseCode(record.departmentCode)
  }

  return (
    <ArchitectureContainer>
      <ArchitectureModal
        modalShow={modalShow}
        modalType={modalType}
        subInfo={subInfo}
        curInfo={curDepart}
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
          loading={isTableLoading}
          expandedRowKeys={expandedRowKeys}
        >
          <Column title="departmentName" dataIndex="departmentName" key="departmentName" />
          <Column
            title="Action"
            key="action"
            align="right"
            render={(text, record) => (
              <span>
                {record.level === 5 && record.totalChildren !== 0 && (
                  <a style={{ marginRight: 16 }} onClick={() => getMoreChildren(record)}>
                    下钻
                  </a>
                )}
                {record.level === 0 && record.departmentLevel !== 1 && (
                  <a style={{ marginRight: 16 }} onClick={() => getMoreParent(record)}>
                    上钻
                  </a>
                )}
                <a style={{ marginRight: 16 }} onClick={() => addChildDepartment(record)}>
                  添加子部门
                </a>
                <a style={{ marginRight: 16 }} onClick={() => editCurDepartment(record)}>
                  编辑
                </a>
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
