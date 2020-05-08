/*
 * @Description: 添加/编辑角色
 * @Author: longzhang6
 * @Date: 2020-05-06 22:11:52
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-05-06 23:38:42
 */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Button, Form, Input, Space, Checkbox } from 'antd'
import TableCheckBox from '@/components/TableCheckBox'
import { Permissions, AuthorisedPermissions } from './MockPermission'

const { TextArea } = Input

const AddEditCharacterForm = () => {
  const [form] = Form.useForm()
  const [, forceUpdate] = useState()
  const [tableData, setTableData] = useState([])
  const [permissionsTableData, setPermissionsTableData] = useState([])
  const [authorisedPermissionsTableData, setAuthorisedPermissionsTableData] = useState([])
  const [permission, setPermission] = useState(false)
  const [authorisedPermission, setAuthorisedPermission] = useState(false)
  const [isPermissionsTableLoading, setIsPermissionsTableLoading] = useState(true)
  const [isAuthorisedPermissionsTableLoading, setIsAuthorisedPermissionsTableLoading] = useState(
    true
  )

  useEffect(() => {
    fetchPermissions()
    fetchAuthorisedPermissions()
  }, [])

  const fetchPermissions = () => {
    setTimeout(() => {
      setPermissionsTableData(Permissions)
      setIsPermissionsTableLoading(false)
    }, 1000)
  }

  const fetchAuthorisedPermissions = () => {
    setTimeout(() => {
      console.log(AuthorisedPermissions)
      setAuthorisedPermissionsTableData(AuthorisedPermissions)
      setIsAuthorisedPermissionsTableLoading(false)
    }, 1000)
  }

  const changePermission = () => {
    setPermission(!permission)
  }

  const changeAuthorisedPermission = () => {
    setAuthorisedPermission(!authorisedPermission)
  }

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
          <TextArea placeholder="备注" autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item>
        <Form.Item name="permission" label="权限" style={{ width: '450px' }} required>
          <>
            <Checkbox
              checked={permission}
              onChange={changePermission}
              style={{
                lineHeight: '32px'
              }}
            >
              全部
            </Checkbox>
          </>
        </Form.Item>
        <Form.Item name="permission" style={{ width: '100%' }} required>
          <TableCheckBox
            bordered
            className="table"
            pagination={false}
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
          style={{ width: '450px' }}
          name="authorisedPermission"
          labelCol={{ span: 7, offset: 0 }}
        >
          <>
            <Checkbox
              checked={authorisedPermission}
              onChange={changeAuthorisedPermission}
              style={{
                lineHeight: '32px'
              }}
            >
              全部
            </Checkbox>
          </>
        </Form.Item>
        <Form.Item name="permission" style={{ width: '100%' }} required>
          <TableCheckBox
            bordered
            className="table"
            pagination={false}
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
                <Button>取消</Button>
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
