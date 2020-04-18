/*
 * @Description: 忘记密码
 * @Author: longzhang6
 * @Date: 2020-04-18 12:03:05
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-18 12:21:16
 */
import React, { useState, useEffect } from 'react'
import { Form, Input, Select, Button, Steps } from 'antd'
import styled from 'styled-components'
import { observer } from 'mobx-react'

const { Step } = Steps
const { Option } = Select

const ForgotPassword = () => {
  const [form] = Form.useForm()

  const onFinish = () => {}

  const onFinishFailed = () => {}

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70
        }}>
        <Option value="86">+86</Option>
      </Select>
    </Form.Item>
  )

  return (
    <ForgotContainer>
      <StepsContainer>
        <Steps current={0}>
          <Step title="确认账号" />
          <Step title="重置密码" />
          <Step title="重置成功" />
        </Steps>
      </StepsContainer>
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{
          prefix: '86'
        }}>
        <Form.Item
          name="phone"
          rules={[
            {
              required: true,
              message: '请输入手机号码'
            },
            {
              pattern: '^1[345789][0-9]{9}$',
              message: '请输入正确的手机号'
            }
          ]}>
          <Input size="large" placeholder="请输入手机号码" addonBefore={prefixSelector} />
        </Form.Item>
        <Form.Item shouldUpdate>
          {() => (
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              disabled={
                !form.isFieldTouched('phone') ||
                form.getFieldsError().filter(({ errors }) => errors.length).length
              }>
              确认
            </Button>
          )}
        </Form.Item>
      </Form>
    </ForgotContainer>
  )
}

const ForgotContainer = styled.div``

const StepsContainer = styled.div`
  margin-bottom: 50px;
`

export default observer(ForgotPassword)
