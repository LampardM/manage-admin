/*
 * @Description: 添加/编辑成员
 * @Author: longzhang6
 * @Date: 2020-04-20 22:14:14
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-20 23:13:25
 */
import React, { useState, useEffect } from 'react'
import { Button, Form, Input, Select, TreeSelect, Checkbox, Space } from 'antd'
import styled from 'styled-components'

const { Option } = Select
const { TextArea } = Input

const AddEditMemberForm = () => {
  const { form } = Form.useForm()

  const tailLayout = {
    wrapperCol: {
      offset: 5
    }
  }

  const treeData = [
    {
      title: 'Node1',
      value: '0-0',
      children: [
        {
          title: 'Child Node1',
          value: '0-0-1'
        },
        {
          title: 'Child Node2',
          value: '0-0-2'
        }
      ]
    },
    {
      title: 'Node2',
      value: '0-1'
    }
  ]

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70
        }}
      >
        <Option value="86">+86</Option>
      </Select>
    </Form.Item>
  )

  const handleCharacterChange = () => {}

  const changeNotice = () => {}

  return (
    <FormContent>
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
          <Input placeholder="手机号码" addonBefore={prefixSelector} />
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
            onChange={handleCharacterChange}
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
            treeData={treeData}
            allowClear
            placeholder="请选择所属部门"
            treeDefaultExpandAll
          />
        </Form.Item>
        <Form.Item name="notice" label="通知方式">
          <NoticeContent>
            <Checkbox defaultChecked={true} disabled>
              短信通知
            </Checkbox>
            <Checkbox onChange={changeNotice}>站内通知</Checkbox>
          </NoticeContent>
        </Form.Item>
        <Form.Item name="desc" label="备注">
          <TextArea placeholder="备注" autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <HandleContainer>
            <Space>
              <Button>取消</Button>
              <Button type="primary">确定</Button>
              <Button type="primary">确定并继续添加</Button>
            </Space>
          </HandleContainer>
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

export default AddEditMemberForm
