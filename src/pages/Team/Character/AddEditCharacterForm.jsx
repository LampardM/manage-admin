/*
 * @Description: 添加/编辑角色
 * @Author: longzhang6
 * @Date: 2020-05-06 22:11:52
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-05-06 23:38:42
 */
/** official **/
import styled from 'styled-components'
import { useStore } from '@/hooks/useStore'
import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'

/** vedor **/
import { Button, Form, Input, Space, Modal, Tooltip, message } from 'antd'
import { ExclamationCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons'

/** custom **/
import TableCheckBox from '@/components/TableCheckBox'
import { createRole, roleDetail, updateRole, getRolePowerConfig } from '@/api'

const { TextArea } = Input
const columns = [
  {
    title: '一级菜单',
    dataIndex: 'first'
  },
  {
    title: '二级菜单',
    dataIndex: 'second'
  },
  {
    title: '权限',
    dataIndex: 'privilege'
  }
]

const SPECIAL_CODE = ['y6be5yQXIt', 'y6beBAB65w']

const AddEditCharacterForm = () => {
  const { id } = useParams()
  const [form] = Form.useForm()
  const history = useHistory()
  const { userInfoStore } = useStore()
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [touched, setTouched] = useState(false)
  const [permissionsTableData, setPermissionsTableData] = useState([])
  const [disableAuthorisedPermissions, setDisableAuthorisedPermissions] = useState(true)
  const [authorisedPermissionsTableData, setAuthorisedPermissionsTableData] = useState([])
  const [permission, setPermission] = useState([])
  const [authorisedPermission, setAuthorisedPermission] = useState([])
  const [isPermissionsTableLoading, setIsPermissionsTableLoading] = useState(true)
  const [isAuthorisedPermissionsTableLoading, setIsAuthorisedPermissionsTableLoading] = useState(
    true
  )

  useEffect(() => {
    if (id) {
      getRoleDetail()
    } else {
      fetchAuthorisedAndPermissions()
    }
  }, [])

  useEffect(() => {
    form.resetFields(['name', 'desc'])
  }, [name, desc])

  const getRoleDetail = () => {
    roleDetail({
      param: id || '',
      token: userInfoStore.token,
      version: userInfoStore.version,
      timestamp: JSON.stringify(new Date().getTime())
    })
      .then(
        ({
          data: {
            roleName,
            memo,
            power: { powerData, empowerData }
          }
        }) => {
          const permissions = dataformatPermissions(powerData)
          const authorisedPermissions = dataformatAuthorisedPermissions(empowerData)

          console.log(permissions, authorisedPermissions)

          setName(roleName)
          setDesc(memo)
          setPermissionsTableData(permissions)
          setAuthorisedPermissionsTableData(authorisedPermissions)
        }
      )
      .finally(() => {
        setIsPermissionsTableLoading(false)
        setIsAuthorisedPermissionsTableLoading(false)
      })
  }

  const fetchAuthorisedAndPermissions = () => {
    getRolePowerConfig({
      param: id || '',
      token: userInfoStore.token,
      version: userInfoStore.version,
      timestamp: JSON.stringify(new Date().getTime())
    })
      .then(({ data: { powerData, empowerData } }) => {
        const permissions = dataformatPermissions(powerData)
        const authorisedPermissions = dataformatAuthorisedPermissions(empowerData)

        console.log(permissions, authorisedPermissions)

        setPermissionsTableData(permissions)
        setAuthorisedPermissionsTableData(authorisedPermissions)
      })
      .finally(() => {
        setIsPermissionsTableLoading(false)
        setIsAuthorisedPermissionsTableLoading(false)
      })
  }

  const dataformatPermissions = dataFormRESTful =>
    dataFormRESTful.map(it => ({
      key: it.code,
      value: it.name,
      checked: it.checkState === 'CHECKED',
      subs: it.children.length ? dataformatPermissions(it.children) : undefined
    }))

  const dataformatAuthorisedPermissions = dataFormRESTful =>
    dataFormRESTful.map(it => ({
      key: it.code,
      value: it.name,
      checked: it.checkState === 'CHECKED',
      subs: it.children.length ? dataformatAuthorisedPermissions(it.children) : undefined
    }))

  const onFinish = values => {
    if (id) {
      doUpdateRole(values)
    } else {
      doCreateRole(values)
    }
  }

  const doUpdateRole = values => {
    updateRole({
      param: {
        empowerCodes: !!disableAuthorisedPermissions ? [] : authorisedPermission,
        memo: values.desc || '',
        powerCodes: permission,
        roleCode: id,
        roleName: values.name
      },
      token: userInfoStore.token,
      version: userInfoStore.version,
      timestamp: JSON.stringify(new Date().getTime())
    }).then(({ success }) => {
      if (+success === 1) {
        message.success('编辑角色成功！', 3, () => {
          history.push(`/team/character`)
        })
      }
    })
  }

  const doCreateRole = values => {
    createRole({
      param: {
        empowerCodes: !!disableAuthorisedPermissions ? [] : authorisedPermission,
        memo: values.desc || '',
        powerCodes: permission,
        roleCode: '',
        roleName: values.name
      },
      token: userInfoStore.token,
      version: userInfoStore.version,
      timestamp: JSON.stringify(new Date().getTime())
    }).then(({ success }) => {
      if (+success === 1) {
        message.success('创建角色成功！', 3, () => {
          history.push(`/team/character`)
        })
      }
    })
  }

  return (
    <FormContent>
      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{
          span: 3
        }}
        initialValues={{
          name,
          desc
        }}
      >
        <Form.Item
          name="name"
          label="角色"
          shouldUpdate
          style={{ width: '450px' }}
          rules={[
            {
              required: true,
              message: '请输入角色名'
            },
            {
              pattern: '^[^ ]+$',
              message: '角色名不能包含空格'
            }
          ]}
        >
          <Input placeholder="请输入角色名" />
        </Form.Item>
        <Form.Item name="desc" label="备注" shouldUpdate style={{ width: '450px' }}>
          <TextArea
            placeholder="备注"
            autoSize={{
              minRows: 3,
              maxRows: 5
            }}
          />
        </Form.Item>
        <Form.Item
          label="权限"
          layout="vertical"
          name="permission"
          labelCol={{
            span: 24
          }}
          style={{
            width: '100%'
          }}
          required
        >
          <TableCheckBox
            className="table"
            name={'权限'}
            bordered
            columns={columns}
            pagination={false}
            showAllChecked={true}
            nodeData={permissionsTableData}
            loading={isPermissionsTableLoading}
            initStructure={tailCollection => {
              if (SPECIAL_CODE.every(it => tailCollection.includes(it))) {
                setDisableAuthorisedPermissions(false)
              } else {
                setDisableAuthorisedPermissions(true)
              }
              setPermission(tailCollection)
            }}
            onChange={(value, isChecked, tailCollection) => {
              if (SPECIAL_CODE.every(it => tailCollection.includes(it))) {
                setDisableAuthorisedPermissions(false)
              } else {
                // setAuthorisedPermission([])
                setDisableAuthorisedPermissions(true)
              }

              setTouched(true)
              setPermission(tailCollection)
            }}
          />
        </Form.Item>

        <Form.Item
          required
          label={
            <>
              <div>可授权角色权限</div>
              <div style={{ margin: '0 6px 0 6px' }}>
                <Tooltip
                  color="rgba(89, 89, 89, 1)"
                  title="用于关联该角色的用户在创建角色时可授权其创建的角色能授权所创建角色的范围"
                >
                  <QuestionCircleOutlined style={{ fontSize: '12px' }} />
                </Tooltip>
              </div>
            </>
          }
          layout="vertical"
          name="authorisedPermission"
          labelCol={{
            span: 24
          }}
          style={{
            width: '100%'
          }}
        >
          <TableCheckBox
            className="table"
            bordered
            columns={columns}
            pagination={false}
            showAllChecked={true}
            disabled={disableAuthorisedPermissions}
            nodeData={authorisedPermissionsTableData}
            loading={isAuthorisedPermissionsTableLoading}
            initStructure={tailCollection => {
              setAuthorisedPermission(tailCollection)
            }}
            onChange={(value, isChecked, tailCollection) => {
              setTouched(true)
              setAuthorisedPermission(tailCollection)
            }}
          />
        </Form.Item>

        <Form.Item shouldUpdate>
          {() => (
            <SubmitCon>
              <Space>
                <Button
                  onClick={() => {
                    Modal.confirm({
                      title: `确认离开？`,
                      icon: <ExclamationCircleOutlined />,
                      content: `是否确认放弃已编辑内容`,
                      onOk() {
                        console.log('OK')
                        history.goBack()
                      }
                    })
                  }}
                >
                  取消
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={
                    (!id &&
                      (!form.isFieldTouched('name') ||
                        !permission.length ||
                        (!disableAuthorisedPermissions && !authorisedPermission.length) ||
                        form.getFieldsError().filter(({ errors }) => errors.length).length)) ||
                    (id && !touched && !form.isFieldTouched('name') && !form.isFieldTouched('desc'))
                  }
                >
                  确定
                </Button>
              </Space>
            </SubmitCon>
          )}
        </Form.Item>
      </Form>
    </FormContent>
  )
}

const FormContent = styled.div``

const SubmitCon = styled.div`
  display: flex;
  justify-content: center;
`

export default styled(AddEditCharacterForm)`
  .table {
    width: 100%;
  }
`
