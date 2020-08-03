/*
 * @Description: 添加/编辑成员
 * @Author: longzhang6
 * @Date: 2020-04-20 22:14:14
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-08-03 22:26:02
 */
import React, { useState, useEffect } from 'react'
import {
  Button,
  Form,
  Input,
  Select,
  TreeSelect,
  Checkbox,
  Space,
  Row,
  Col,
  message,
  Modal
} from 'antd'
import { useStore } from '@/hooks/useStore'
import styled from 'styled-components'
import { getRoleList } from '@/api/user'
import { inviteMember, getMemberDetail, updateMemberDetail } from '@/api/member'
import { getCurDepartment } from '@/api/department'
import { useHistory } from 'react-router-dom'
import PrefixSelector from '@/components/PrefixSelector/PrefixSelector'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const { TreeNode } = TreeSelect
const { Option } = Select
const { TextArea } = Input

const AddEditMemberForm = props => {
  const [form] = Form.useForm()
  const { userInfoStore } = useStore()
  const [characterList, setCharacterList] = useState([])
  const [curCharacter, setCurCharacter] = useState([])
  const [department, setDepartment] = useState([])
  const [notice, setNotice] = useState(false)
  const [depart, setDepart] = useState('')
  const [memberDetail, setMemberDetail] = useState({})
  const [, forceUpdate] = useState()
  const history = useHistory()

  const tailLayout = {
    wrapperCol: {
      offset: 5
    }
  }

  useEffect(() => {
    props.memberCode && getCurMemberDetail()
    getCurRoleList()
    getCurDepartmentList()
  }, [])

  useEffect(() => {
    if (memberDetail && memberDetail.phone) {
      console.log(memberDetail, 'memberDetail')
      let _character = memberDetail.roles.map(character => character.roleCode),
        _department = memberDetail.depts.map(dep => dep.deptCode)

      setTimeout(() => {
        form.setFieldsValue({
          name: memberDetail.orgMemberName,
          phone: memberDetail.phone,
          desc: memberDetail.memo,
          character: _character,
          department: _department
        })
        setCurCharacter(_character)
      }, 500)
    }
  }, [memberDetail])

  const getCurMemberDetail = () => {
    form.resetFields()
    let _params = {
      param: props.memberCode,
      timestamp: JSON.stringify(new Date().getTime()),
      token: userInfoStore.token,
      version: userInfoStore.version
    }

    getMemberDetail(_params)
      .then(_result => {
        console.log(_result, '成员信息')
        setMemberDetail(_result.data)
      })
      .catch(err => console.log(err))
  }

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

  const selectCurdepartment = value => {
    setDepart(value)
  }

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

  const addMemberSubmit = () => {
    let formValue = form.getFieldsValue(),
      _createparams = {
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
      },
      _editparams = {
        param: {
          depts: formValue.department,
          memo: formValue.desc,
          orgMemberCode: memberDetail.orgMemberCode,
          orgMemberName: formValue.name,
          phone: formValue.phone,
          roles: formValue.character
        },
        timestamp: JSON.stringify(new Date().getTime()),
        token: userInfoStore.token,
        version: userInfoStore.version
      }
    if (props.memberCode) {
      updateMemberDetail(_editparams)
        .then(_result => {
          message.success('编辑成功！')
          history.push('/team/member')
        })
        .catch(err => console.log(err))
    } else {
      inviteMember(_createparams)
        .then(_result => {
          message.success('添加成功！')
          history.push('/team/member')
        })
        .catch(err => {})
    }
  }

  const addAnotherMemberSubmit = () => {
    let formValue = form.getFieldsValue(),
      _createparams = {
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
    inviteMember(_createparams)
      .then(_result => {
        message.success('添加成功！')
        form.setFieldsValue({
          name: '',
          phone: '',
          registerphone: '',
          desc: ''
        })
        setNotice(false)
      })
      .catch(err => {})
  }

  return (
    <FormContent>
      <Form
        form={form}
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
          <Input placeholder="手机号码" addonBefore={PrefixSelector} disabled={props.memberCode} />
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
            value={curCharacter}
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
            multiple={props.memberCode ? true : false}
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            onSelect={selectCurdepartment}
            allowClear
            value={depart}
            placeholder="请选择所属部门"
            listItemHeight={10}
            listHeight={250}
            treeDefaultExpandAll
          >
            {renderTreeNode(department)}
          </TreeSelect>
        </Form.Item>
        {!props.memberCode ? (
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
                    checked={notice}
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
        ) : null}
        {!props.memberCode ? (
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
        ) : null}
        <Form.Item name="desc" label="备注">
          <TextArea placeholder="备注" autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item>
        <Form.Item {...tailLayout} shouldUpdate>
          {() => (
            <HandleContainer>
              <Space>
                <Button
                  onClick={() =>
                    Modal.confirm({
                      title: '确认离开?',
                      icon: <ExclamationCircleOutlined />,
                      content: '是否确认放弃所编辑内容',
                      onOk() {
                        history.goBack()
                      },
                      onCancel() {
                        console.log('Cancel')
                      }
                    })
                  }
                >
                  取消
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={addMemberSubmit}
                  disabled={
                    props.memberCode
                      ? !form.isFieldTouched('phone') ||
                        !form.isFieldTouched('character') ||
                        !form.isFieldTouched('department') ||
                        (form.getFieldValue('character') &&
                          form.getFieldValue('character').length === 0) ||
                        (form.getFieldValue('department') &&
                          form.getFieldValue('department').length === 0) ||
                        form.getFieldsError().filter(({ errors }) => errors.length).length
                      : !form.isFieldTouched('name') ||
                        !form.isFieldTouched('phone') ||
                        !form.isFieldTouched('character') ||
                        !form.isFieldTouched('department') ||
                        !form.isFieldTouched('registerphone') ||
                        !form.getFieldValue('name') ||
                        !form.getFieldValue('phone') ||
                        !form.getFieldValue('registerphone') ||
                        form.getFieldsError().filter(({ errors }) => errors.length).length
                  }
                >
                  确定
                </Button>
                {!props.memberCode ? (
                  <Button
                    type="primary"
                    onClick={addAnotherMemberSubmit}
                    disabled={
                      !form.isFieldTouched('name') ||
                      !form.isFieldTouched('phone') ||
                      !form.isFieldTouched('character') ||
                      !form.isFieldTouched('department') ||
                      !form.isFieldTouched('registerphone') ||
                      !form.getFieldValue('name') ||
                      !form.getFieldValue('phone') ||
                      !form.getFieldValue('registerphone') ||
                      form.getFieldsError().filter(({ errors }) => errors.length).length
                    }
                  >
                    确定并继续添加
                  </Button>
                ) : null}
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
