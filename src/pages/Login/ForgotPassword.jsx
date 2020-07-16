/*
 * @Description: 忘记密码
 * @Author: longzhang6
 * @Date: 2020-04-18 12:03:05
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-07-16 22:12:19
 */
import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Steps, message, Result } from 'antd'
import useInterval from '@/hooks/useInterval'
import PrefixSelector from '@/components/PrefixSelector/PrefixSelector'
import { observer } from 'mobx-react'
import { useStore } from '@/hooks/useStore'
import { useHistory } from 'react-router-dom'
import { getResetPasswordVerify, resetPassword } from '@/api/user'
import styled from 'styled-components'

const { Step } = Steps

const ForgotPassword = () => {
  const [form] = Form.useForm()
  const { userInfoStore } = useStore()
  const [step, setStep] = useState(0)
  const [isSendVerify, setIsSendVerify] = useState(false)
  const [curPhone, setCurPhone] = useState('')
  const [countDown, setCountDown] = useState(5)
  const [, forceUpdate] = useState()
  const history = useHistory()

  const captchaCallback = res => {
    let resetFormValue = form.getFieldsValue()
    console.log(resetFormValue, 'resetFormValue')
    console.log(res, 'res')
    if (!res.randstr || !res.ticket || res.ret === 2) return
    if (step === 0) {
      setStep(step + 1)
      setCurPhone(resetFormValue.phone)
    } else if (step === 1) {
      let _params = {
        phone: curPhone,
        ticket: res.ticket,
        rand: res.randstr
      }
      getResetPasswordVerify(_params)
        .then(_result => {
          message.success('验证码发送成功！')
          setIsSendVerify(true)
        })
        .catch(err => console.log(err))
    }
  }

  const registerCaptcha = new window.TencentCaptcha(userInfoStore.appId, captchaCallback)

  const onFinish = () => {
    let resetFormValue = form.getFieldsValue()
    if (step === 0) {
      registerCaptcha.show()
    } else if (step === 1) {
      console.log(resetFormValue, 'resetFormValue')
      let _params = {
        newPassword: resetFormValue.confirm,
        sms: resetFormValue.Verification,
        phone: curPhone
      }
      resetPassword(_params)
        .then(res => {
          message.success('密码重置成功！')
          setStep(step + 1)
        })
        .catch(err => console.log(err))
    }
  }

  useEffect(() => {
    if (countDown === 0) {
      setIsSendVerify(false)
      setCountDown(5)
    }
    forceUpdate({})
  }, [countDown])

  useInterval(
    () => {
      setCountDown(countDown => countDown - 1)
    },
    1000,
    isSendVerify
  )

  const goLogin = () => {
    history.push('/login')
  }

  const onFinishFailed = () => {}

  const verifyPhone = () => {
    // * 滑动验证
    registerCaptcha.show()
  }

  const afterSelector = (
    <Form.Item noStyle shouldUpdate>
      {() => (
        <Button
          type="link"
          block
          disabled={
            !form.isFieldTouched('password') ||
            form.getFieldError('password').length ||
            !form.isFieldTouched('confirm') ||
            form.getFieldError('confirm').length ||
            isSendVerify
          }
          onClick={verifyPhone}
        >
          {!isSendVerify ? '获取验证码' : `${countDown}秒后重新获取`}
        </Button>
      )}
    </Form.Item>
  )

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
              <Form.Item
                name="Verification"
                rules={[
                  {
                    required: true,
                    message: '请输入验证码!'
                  },
                  {
                    max: 6,
                    min: 6,
                    message: '验证码长度为6位'
                  },
                  {
                    pattern: '^[0-9]+$',
                    message: '验证码有误，请重新输入'
                  }
                ]}
              >
                <Input placeholder="请输入验证码" size="large" addonAfter={afterSelector} />
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
                        !form.isFieldTouched('Verification') ||
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
