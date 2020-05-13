/*
 * @Description: 忘记密码
 * @Author: longzhang6
 * @Date: 2020-04-18 12:03:05
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-05-13 22:22:24
 */
import React, { useState, useEffect } from 'react'
import { Form, Input, Select, Button, Steps, message, Result } from 'antd'
import PrefixSelector from '@/components/PrefixSelector/PrefixSelector'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

const { Step } = Steps
const { Option } = Select

const ForgotPassword = () => {
  const [form] = Form.useForm()
  const [step, setStep] = useState(0)
  const history = useHistory()

  const onFinish = () => {
    if (step === 0) {
      // TODO 验证手机号码是否注册
      setStep(step + 1)
    } else if (step === 1) {
      // TODO 重置密码
      setStep(step + 1)
      message.success('密码重置成功！')
    }
  }

  useEffect(() => {})

  const goLogin = () => {
    history.push('/login')
  }

  const onFinishFailed = () => {}

  return (
    <ForgotContainer>
      <StepsContainer>
        <Steps current={step}>
          <Step title="确认账号" />
          <Step title="重置密码" />
          <Step title="重置成功" />
        </Steps>
      </StepsContainer>
      <InfoContainer>
        <Form
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{
            prefix: '86'
          }}
        >
          {step === 0 ? (
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
              ]}
            >
              <Input size="large" placeholder="请输入手机号码" addonBefore={PrefixSelector} />
            </Form.Item>
          ) : step === 1 ? (
            <React.Fragment>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: '请输入登录密码!'
                  },
                  {
                    pattern: '^[A-Za-z0-9!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~]+$',
                    message: '密码包含数字字母和常用特殊符号'
                  },
                  {
                    max: 16,
                    min: 6,
                    message: '密码长度为6到16位'
                  }
                ]}
                hasFeedback
              >
                <Input.Password placeholder="请输入登录密码" size="large" />
              </Form.Item>
              <Form.Item
                name="confirm"
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: '请输入密码!'
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }

                      return Promise.reject('两次输入密码不一致!')
                    }
                  })
                ]}
              >
                <Input.Password placeholder="请确认登录密码" size="large" />
              </Form.Item>
            </React.Fragment>
          ) : (
            <Result
              status="success"
              title="密码重置成功"
              extra={
                <Button type="primary" size="large" onClick={goLogin}>
                  去登录
                </Button>
              }
            />
          )}
          {step < 2 ? (
            <Form.Item shouldUpdate>
              {() => (
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  disabled={
                    step === 0
                      ? !form.isFieldTouched('phone') ||
                        form.getFieldsError().filter(({ errors }) => errors.length).length
                      : !form.isFieldTouched('password') ||
                        !form.isFieldTouched('confirm') ||
                        form.getFieldsError().filter(({ errors }) => errors.length).length
                  }
                >
                  确认
                </Button>
              )}
            </Form.Item>
          ) : null}
        </Form>
      </InfoContainer>
    </ForgotContainer>
  )
}

const ForgotContainer = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const InfoContainer = styled.div`
  width: 420px;
`

const StepsContainer = styled.div`
  width: 600px;
  margin-bottom: 50px;
`

export default observer(ForgotPassword)
