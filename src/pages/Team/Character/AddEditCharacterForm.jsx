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
import { Button, Form, Input, Space, Checkbox, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

/** custom **/
import TableCheckBox from '@/components/TableCheckBox'
import { getRolePowerConfig } from '@/api'

const { TextArea } = Input

const AddEditCharacterForm = () => {
  const { id } = useParams()
  const [form] = Form.useForm()
  const history = useHistory()
  const { userInfoStore } = useStore()
  const [tableData, setTableData] = useState([])
  const [permissionsTableData, setPermissionsTableData] = useState([])
  const [authorisedPermissionsTableData, setAuthorisedPermissionsTableData] = useState([])
  const [permission, setPermission] = useState(false)
  const [isPermissionsTableLoading, setIsPermissionsTableLoading] = useState(true)
  const [isAuthorisedPermissionsTableLoading, setIsAuthorisedPermissionsTableLoading] = useState(
    true
  )

  useEffect(() => {
    fetchAuthorisedAndPermissions()
  }, [])

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

  return (
    <FormContent>
      <Form
        form={form}
        labelCol={{
          span: 3
        }}
      >
        <Form.Item
          name="name"
          label="角色"
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
        <Form.Item name="desc" label="备注" style={{ width: '450px' }}>
          <TextArea
            placeholder="备注"
            autoSize={{
              minRows: 3,
              maxRows: 5
            }}
          />
        </Form.Item>
        <Form.Item
          name="permission"
          label="权限"
          style={{
            width: '450px',
            marginBottom: 0
          }}
          required
        >
          {/* <Checkbox
            checked={permission}
            onChange={changePermission}
            style={{
              lineHeight: '32px'
            }}
          >
            全部
          </Checkbox> */}
        </Form.Item>
        <Form.Item style={{ width: '100%' }} required>
          <TableCheckBox
            bordered
            className="table"
            pagination={false}
            showAllChecked={true}
            loading={isPermissionsTableLoading}
            rowKey={(row, idx, self) => {
              // console.log('rowKey', row)
              return idx
            }}
            columns={[
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
            ]}
            nodeData={permissionsTableData}
          />
        </Form.Item>

        <Form.Item
          required
          labelAlign="left"
          label="可授权角色权限"
          style={{
            width: '450px',
            marginBottom: 0
          }}
          labelCol={{ span: 7, offset: 0 }}
        >
          {/*  <Checkbox
            checked={authorisedPermission}
            onChange={changeAuthorisedPermission}
            style={{
              lineHeight: '32px'
            }}
          >
            全部
          </Checkbox> */}
        </Form.Item>
        <Form.Item name="permission" style={{ width: '100%' }} required>
          <TableCheckBox
            bordered
            className="table"
            pagination={false}
            showAllChecked={true}
            loading={isAuthorisedPermissionsTableLoading}
            rowKey={(row, idx, self) => {
              // console.log('rowKey', row)
              return idx
            }}
            columns={[
              {
                title: '一级菜单',
                dataIndex: 'first'
              },
              {
                title: '二级菜单',
                dataIndex: 'second'
              }
            ]}
            nodeData={authorisedPermissionsTableData}
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
                  disabled={
                    !form.isFieldTouched('name') ||
                    !permission ||
                    form.getFieldsError().filter(({ errors }) => errors.length).length
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
    /* width: 100%; */
  }
`
