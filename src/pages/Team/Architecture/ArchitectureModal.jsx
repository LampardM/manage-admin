/*
 * @Description: 组织架构Modal
 * @Author: longzhang6
 * @Date: 2020-04-19 17:03:34
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-07-17 21:45:00
 */
import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, TreeSelect } from 'antd'
import { getCurDepartment } from '@/api/department'
import { useStore } from '@/hooks/useStore'
import { useLocalStorageState } from '@umijs/hooks'
import { observer } from 'mobx-react'
import { getCurDepart } from '@/utils/session'
import styled from 'styled-components'

const ArchitectureModal = ({ modalShow, modalType, subInfo, curInfo, onCreate, onCancel }) => {
  const { userInfoStore } = useStore()
  const [form] = Form.useForm()
  const [disabled, setDisabled] = useState(true)
  const [depart, setDepart] = useState('')
  const [departInfo, setDepartInfo] = useState({})
  const [departList, setDepartList] = useState([])
  const [userOrganizes] = useLocalStorageState('user-organizes')
  const { TreeNode } = TreeSelect

  useEffect(() => {
    modalShow && form.resetFields() && form.setFieldsValue({ updatedepartment: '' })
    modalShow && getCurDepartmentList(true, subInfo)
  }, [modalShow])

  const changeFetchDataProp = arr => {
    arr.forEach(_item => {
      _item.value = _item.departmentCode
      _item.title = _item.departmentName

      if (_item.children && _item.children.length > 0) {
        changeFetchDataProp(_item.children)
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

  const handleInitStatus = curdepartlist => {
    if (subInfo) {
      setDepart(subInfo)
      form.setFieldsValue({ updepartment: subInfo })
    } else {
      curdepartlist[0] &&
        curdepartlist[0].value &&
        form.setFieldsValue({ updepartment: curdepartlist[0].value }) &&
        setDepart(curdepartlist[0].value)
    }
    if (modalType === 'edit') {
      setDepartInfo(curInfo)
      form.setFieldsValue({ department: curInfo.departmentName })
    } else {
      setDepartInfo({})
      form.setFieldsValue({ department: '' })
    }
  }

  // 获取当前组织架构列表
  const getCurDepartmentList = (isfirst, baseCode, drillingDown = false) => {
    let _params = {
      param: {
        baseDepartmentCode: baseCode ? baseCode : '',
        buildChild: isfirst ? (baseCode ? true : false) : drillingDown, // true 下钻 false 上钻
        excludeCode: [],
        totalNodeLevel: 6
      },
      timestamp: JSON.stringify(new Date().getTime()),
      token: userInfoStore.token,
      version: userInfoStore.version
    }

    getCurDepartment(_params)
      .then(_result => {
        let _lastData
        changeFetchDataProp(_result.data)
        countDepartLevel(_result.data)

        if (isfirst) {
          if (baseCode) {
            if (_result.data && _result.data.length > 0 && _result.data[0].departmentLevel === 1) {
              _lastData = unshiftCurDepart(_result.data)
            } else {
              _lastData = _result.data
            }
          } else {
            _lastData = unshiftCurDepart(_result.data)
          }
        } else {
          if (_result.data && _result.data.length > 0 && _result.data[0].departmentLevel === 1) {
            _lastData = unshiftCurDepart(_result.data)
          } else {
            _lastData = _result.data
          }
        }

        setDepartList(_lastData)
        if (isfirst) {
          handleInitStatus(_lastData)
        }
      })
      .catch(err => {
        console.log(err)
        let _lastData = isfirst ? unshiftCurDepart([]) : []
        setDepartList(_lastData)
        if (isfirst) {
          handleInitStatus(_lastData)
        }
      })
  }

  // 将当前团队补到首层
  const unshiftCurDepart = data => {
    let _curRoot, _curRootResult
    _curRoot = userOrganizes.filter(organization => {
      return organization.code === getCurDepart()
    })

    _curRootResult = _curRoot.map(organization => {
      return {
        departmentCode: organization.code,
        departmentName: organization.name,
        value: organization.code,
        title: organization.name,
        children: data
      }
    })

    return _curRootResult
  }

  const setSubmitIsDisabled = () => {
    setDisabled(
      !form.isFieldTouched('department') ||
        !form.getFieldValue('updepartment') ||
        form.getFieldsError().filter(({ errors }) => errors.length).length
    )
  }

  const onFieldsChange = () => {
    setSubmitIsDisabled()
  }

  const onChange = value => {
    setDepart(value)
  }

  const drillingDown = (e, node) => {
    e.stopPropagation()
    getCurDepartmentList(false, node.departmentCode, true)
  }

  const drillingUp = (e, node) => {
    e.stopPropagation()
    getCurDepartmentList(false, node.departmentCode, false)
  }

  const renderTreeNode = data => {
    return data.map(node => {
      if (node.children.length === 0) {
        return (
          <TreeNode
            title={
              node.level === 5 && node.totalChildren !== 0 ? (
                <SelectDepart>
                  <DepartName>{node.departmentName}</DepartName>
                  <DownButton onClick={e => drillingDown(e, node)}>下钻</DownButton>
                </SelectDepart>
              ) : node.level === 0 && node.departmentLevel !== 1 ? (
                <SelectDepart>
                  <DepartName>{node.departmentName}</DepartName>
                  <DownButton onClick={e => drillingUp(e, node)}>上钻</DownButton>
                </SelectDepart>
              ) : (
                node.departmentName
              )
            }
            value={node.departmentCode}
            key={node.departmentCode}
          ></TreeNode>
        )
      } else {
        return (
          <TreeNode
            title={
              node.level === 5 && node.totalChildren !== 0 ? (
                <SelectDepart>
                  <DepartName>{node.departmentName}</DepartName>
                  <DownButton onClick={e => drillingDown(e, node)}>下钻</DownButton>
                </SelectDepart>
              ) : node.level === 0 && node.departmentLevel !== 1 ? (
                <SelectDepart>
                  <DepartName>{node.departmentName}</DepartName>
                  <DownButton onClick={e => drillingUp(e, node)}>上钻</DownButton>
                </SelectDepart>
              ) : (
                node.departmentName
              )
            }
            value={node.departmentCode}
            key={node.departmentCode}
          >
            {renderTreeNode(node.children)}
          </TreeNode>
        )
      }
    })
  }

  return (
    <Modal
      visible={modalShow}
      getContainer={false}
      title={modalType === 'create' ? '添加部门' : '编辑部门'}
      okButtonProps={{
        disabled: disabled
      }}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            form.resetFields()
            onCreate(values, curInfo)
          })
          .catch(info => {
            console.log('Validate Failed:', info)
          })
      }}
    >
      <Form
        form={form}
        name="formModal"
        onFieldsChange={onFieldsChange}
        initialValues={{
          updepartment: depart,
          department: departInfo.departmentName
        }}
      >
        <Form.Item
          name="department"
          label="部门名称"
          rules={[
            {
              required: true,
              message: '请输入部门名称!'
            },
            {
              pattern: '^[\u4e00-\u9fa5_a-zA-Z0-9]+$',
              message: '部门名称由中文，数字，下划线和字母组成'
            },
            {
              max: 25,
              min: 1,
              message: '部门名称长度为1到25位'
            }
          ]}
        >
          <Input placeholder="请输入部门名称" />
        </Form.Item>
        <Form.Item
          name="updepartment"
          label="上级部门"
          rules={[
            {
              required: true,
              message: '请选择上级部门!'
            }
          ]}
        >
          <TreeSelect
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            value={depart}
            treeDefaultExpandAll
            onChange={onChange}
            listItemHeight={10}
            listHeight={250}
          >
            {renderTreeNode(departList)}
          </TreeSelect>
        </Form.Item>
      </Form>
    </Modal>
  )
}

const SelectDepart = styled.span`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`

const DownButton = styled.a`
  padding-right: 20px;
`

const DepartName = styled.div``

export default observer(ArchitectureModal)
