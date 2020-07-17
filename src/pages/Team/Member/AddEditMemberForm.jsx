/*
 * @Description: 添加/编辑成员
 * @Author: longzhang6
 * @Date: 2020-04-20 22:14:14
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-07-17 20:57:43
 */
import React, { useState, useEffect } from 'react'
import { Button, Form, Input, Select, TreeSelect, Checkbox, Space, Row, Col, message } from 'antd'
import { useStore } from '@/hooks/useStore'
import styled from 'styled-components'
import { getRoleList } from '@/api/user'
import { inviteMember } from '@/api/member'
import { getCurDepartment } from '@/api/department'
import PrefixSelector from '@/components/PrefixSelector/PrefixSelector'

const { TreeNode } = TreeSelect
const { Option } = Select
const { TextArea } = Input

const AddEditMemberForm = () => {
  const [form] = Form.useForm()
  const { userInfoStore } = useStore()
  const [characterList, setCharacterList] = useState([])
  const [curCharacter, setCurCharacter] = useState([])
  const [department, setDepartment] = useState([])
  const [notice, setNotice] = useState(false)

  const tailLayout = {
    wrapperCol: {
      offset: 5
    }
  }

  useEffect(() => {
    getCurRoleList()
    getCurDepartmentList()
  }, [])

  const handleCharacterChange = value => {
    setCurCharacter(value)
  }

  const countDepartLevel = (arr, level = 0) => {
    arr.forEach(_item => {
      _item.level = level
      if (_item.children) {
        countDepartLevel(_item.children, level + 1)
      }
    })
  }

  const changeFetchDataProp = arr => {
    arr.forEach(_item => {
      _item.value = _item.departmentCode
      _item.title = _item.departmentName

      if (_item.children && _item.children.length > 0) {
        changeFetchDataProp(_item.children)
      }
    })
  }

  const getCurDepartmentList = (baseCode = '', drillingDown = false) => {
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
        countDepartLevel(_result.data)
        changeFetchDataProp(_result.data)
        setDepartment(_result.data)
        console.log(_result.data, 'department')
      })
      .catch(err => console.log(err))
  }

  const getCurRoleList = () => {
    let _params = {
      param: {
        pageSize: 100,
        pageIndex: 0,
        param: {
          roleName: '',
          state: 'ENABLED'
        }
      },
      timestamp: JSON.stringify(new Date().getTime()),
      token: userInfoStore.token,
      version: userInfoStore.version
    }
    getRoleList(_params)
      .then(_result => {
        setCharacterList(_result.data.rows)
      })
      .catch(err => console.log(err))
  }

  const selectCurdepartment = value => {}

  const onChange = value => {
    setNotice(value.target.checked)
  }

  const drillingDepartDown = (e, node) => {
    e.stopPropagation()
    getCurDepartmentList(node.departmentCode, true)
  }

  const drillingDepartUp = (e, node) => {
    e.stopPropagation()
    getCurDepartmentList(node.departmentCode, false)
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
                  <DownButton onClick={e => drillingDepartDown(e, node)}>下钻</DownButton>
                </SelectDepart>
              ) : node.level === 0 && node.departmentLevel !== 1 ? (
                <SelectDepart>
                  <DepartName>{node.departmentName}</DepartName>
                  <DownButton onClick={e => drillingDepartUp(e, node)}>上钻</DownButton>
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
                  <DownButton onClick={e => drillingDepartDown(e, node)}>下钻</DownButton>
                </SelectDepart>
              ) : node.level === 0 && node.departmentLevel !== 1 ? (
                <SelectDepart>
                  <DepartName>{node.departmentName}</DepartName>
                  <DownButton onClick={e => drillingDepartUp(e, node)}>上钻</DownButton>
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

  const onFinish = () => {
    let formValue = form.getFieldsValue(),
      _params = {
        param: {
          departmentCode: formValue.department,
          inviteType: notice ? 'BOTH' : 'SMS',
          memberName: formValue.name,
          memo: formValue.desc,
          phone: formValue.phone,
          registPhone: formValue.registerphone,
          roleCode: formValue.character
        },
        timestamp: JSON.stringify(new Date().getTime()),
        token: userInfoStore.token,
        version: userInfoStore.version
      }
    inviteMember(_params)
      .then(_result => {
        message.success('添加成功！')
      })
      .catch(err => {})
  }

  return (
    <FormContent>
      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{
          span: 5
        }}
        initialValues={{
          prefix: '86'
        }}
      >
        <Form.Item
          name="name"
          label="姓名"
          rules={[
            {
              required: true,
              message: '请输入姓名'
            },
            {
              pattern: '^[^ ]+$',
              message: '姓名不能包含空格'
            }
          ]}
        >
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="手机号码"
          rules={[
            {
              required: true,
              message: '请输入手机号码'
            },
            {
              pattern: '^1[345789][0-9]{9}$',
              message: '请输入正确的手机号'
            }
          ]}
        >
          <Input placeholder="手机号码" addonBefore={PrefixSelector} />
        </Form.Item>
        <Form.Item
          name="character"
          label="角色"
          rules={[
            {
              required: true,
              message: '请选择角色'
            }
          ]}
        >
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="请选择角色"
            onChange={handleCharacterChange}
          >
            {characterList.map(d => (
              <Option key={d.roleCode}>{d.roleName}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="department"
          label="部门"
          rules={[
            {
              required: true,
              message: '请选择部门'
            }
          ]}
        >
          <TreeSelect
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            onSelect={selectCurdepartment}
            allowClear
            placeholder="请选择所属部门"
            listItemHeight={10}
            listHeight={250}
            treeDefaultExpandAll
          >
            {renderTreeNode(department)}
          </TreeSelect>
        </Form.Item>
        <Form.Item name="checkbox-group" label="通知方式">
          <NoticeContent>
            <Row>
              <Col>
                <Checkbox
                  style={{
                    lineHeight: '32px'
                  }}
                  defaultChecked
                  disabled
                >
                  通过联系手机号发送短信通知
                </Checkbox>
              </Col>
            </Row>
            <Row>
              <Col>
                <Checkbox
                  onChange={onChange}
                  style={{
                    lineHeight: '32px'
                  }}
                >
                  通过注册手机号发送站内通知
                </Checkbox>
              </Col>
            </Row>
          </NoticeContent>
        </Form.Item>
        <Form.Item
          name="registerphone"
          label="注册手机号"
          rules={[
            {
              required: true,
              message: '请输入注册手机号'
            },
            {
              pattern: '^1[345789][0-9]{9}$',
              message: '请输入正确的手机号'
            }
          ]}
        >
          <Input placeholder="请输入注册手机号" addonBefore={PrefixSelector} />
        </Form.Item>
        <Form.Item name="desc" label="备注">
          <TextArea placeholder="备注" autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item>
        <Form.Item {...tailLayout} shouldUpdate>
          {() => (
            <HandleContainer>
              <Space>
                <Button>取消</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={
                    !form.isFieldTouched('name') ||
                    !form.isFieldTouched('phone') ||
                    !form.isFieldTouched('character') ||
                    !form.isFieldTouched('registerphone') ||
                    form.getFieldsError().filter(({ errors }) => errors.length).length
                  }
                >
                  确定
                </Button>
                <Button
                  type="primary"
                  disabled={
                    !form.isFieldTouched('name') ||
                    !form.isFieldTouched('phone') ||
                    !form.isFieldTouched('character') ||
                    !form.isFieldTouched('registerphone') ||
                    form.getFieldsError().filter(({ errors }) => errors.length).length
                  }
                >
                  确定并继续添加
                </Button>
              </Space>
            </HandleContainer>
          )}
        </Form.Item>
      </Form>
    </FormContent>
  )
}

const FormContent = styled.div`
  width: 450px;
`

const NoticeContent = styled.div``

const HandleContainer = styled.div``

const SelectDepart = styled.span`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`

const DownButton = styled.a`
  padding-right: 20px;
`

const DepartName = styled.div``

export default AddEditMemberForm
