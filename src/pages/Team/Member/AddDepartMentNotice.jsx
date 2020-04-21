/*
 * @Description: 加入团队通知页
 * @Author: longzhang6
 * @Date: 2020-04-21 10:55:41
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-21 22:56:41
 */
import React from 'react'
import styled from 'styled-components'
import { Button, Form, Input, Space, Select } from 'antd'

const { Option } = Select

const AddDepartMentNotice = () => {
  const { form } = Form.useForm()

  const tailLayout = {
    wrapperCol: {
      offset: 5
    }
  }

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

  return (
    <div style={{ padding: '0 16 16', marginTop: -16 }}>
      <AddDepartMentNoticeCon>
        <AddDepartTitle>加入团队</AddDepartTitle>
        <AddDepartContent>
          <RealContent>
            <AddDepartMentTitle>浙江xx公司邀请您加入团队</AddDepartMentTitle>
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
                <Input placeholder="手机号码" addonBefore={prefixSelector} />
              </Form.Item>
              <Form.Item
                name="verify"
                label="验证码"
                rules={[
                  {
                    required: true,
                    message: '请输入验证码'
                  },
                  {
                    pattern: '^[0-9]{6}$',
                    message: '请输入正确的验证码'
                  }
                ]}
              >
                <Space>
                  <Input placeholder="请输入验证码" />
                  <Button type="primary">获取验证码</Button>
                </Space>
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Button type="primary">加入</Button>
              </Form.Item>
            </Form>
          </RealContent>
        </AddDepartContent>
      </AddDepartMentNoticeCon>
    </div>
  )
}

const AddDepartMentNoticeCon = styled.div`
  width: 100%;
`

const AddDepartTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  padding: 0 16px 10px;
  background-color: #fff;
`

const AddDepartContent = styled.div`
  margin: 16px;
  padding: 16px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`

const RealContent = styled.div`
  width: 420px;
`

const AddDepartMentTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 50px;
  text-align: center;
`

export default AddDepartMentNotice
