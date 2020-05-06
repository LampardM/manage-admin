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

const { TextArea } = Input

const AddEditCharacterForm = () => {
  const [form] = Form.useForm()
  const [permission, setPermission] = useState(false)
  const [, forceUpdate] = useState()

  const changePermission = () => {
    setPermission(!permission)
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
            <div>table</div>
          </>
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

export default AddEditCharacterForm
