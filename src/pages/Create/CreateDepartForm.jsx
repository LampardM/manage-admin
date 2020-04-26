/*
 * @Description: 创建团队表单
 * @Author: longzhang6
 * @Date: 2020-04-26 09:40:41
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-26 09:56:28
 */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import { Button, Form, Input, Select, TreeSelect, Checkbox, Space, Row, Col } from 'antd'
import PrefixSelector from '@/components/PrefixSelector/PrefixSelector'

const { Option } = Select
const { TextArea } = Input

const CreateDepartForm = () => {
  const { form } = Form.useForm()

  const tailLayout = {
    wrapperCol: {
      offset: 5
    }
  }

  const handleDepartKindChange = () => {}

  return (
    <DepartFormCon>
      <FormContainer>
        <Form
          form={form}
          labelCol={{
            span: 5
          }}
          initialValues={{
            prefix: '86',
            character: ['china']
          }}
        >
          <Form.Item
            name="name"
            label="团队名称"
            rules={[
              {
                required: true,
                message: '请输入团队名称'
              },
              {
                pattern: '^[^ ]+$',
                message: '团队名称不能包含空格'
              }
            ]}
          >
            <Input placeholder="请输入团队名称" />
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
              placeholder="select one country"
              onChange={handleDepartKindChange}
              optionLabelProp="label"
            >
              <Option value="china" label="China">
                <div className="demo-option-label-item">
                  <span role="img" aria-label="China">
                    🇨🇳
                  </span>
                  China (中国)
                </div>
              </Option>
              <Option value="usa" label="USA">
                <div className="demo-option-label-item">
                  <span role="img" aria-label="USA">
                    🇺🇸
                  </span>
                  USA (美国)
                </div>
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="connect"
            label="联系人"
            rules={[
              {
                required: true,
                message: '请输入联系人'
              },
              {
                pattern: '^[^ ]+$',
                message: '请输入联系人姓名'
              }
            ]}
          >
            <Input placeholder="联系人" />
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
          <Form.Item name="desc" label="备注">
            <TextArea placeholder="备注" autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <HandleContainer>
              <Space>
                <Button>取消</Button>
                <Button type="primary">提交申请</Button>
              </Space>
            </HandleContainer>
          </Form.Item>
        </Form>
      </FormContainer>
    </DepartFormCon>
  )
}

const DepartFormCon = styled.div`
  margin: 16px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px;
`
const FormContainer = styled.div`
  width: 450px;
`

const HandleContainer = styled.div``

export default observer(CreateDepartForm)
