/*
 * @Description: 注册组件
 * @Author: longzhang6
 * @Date: 2020-04-13 22:23:37
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-05-11 22:36:59
 */
import React, { useState, useEffect } from 'react'
import { Form, Input, Select, Button, message } from 'antd'
import { useStore } from '@/hooks/useStore'
import useInterval from '@/hooks/useInterval'
import styled from 'styled-components'
import PrefixSelector from '@/components/PrefixSelector/PrefixSelector'
import { observer } from 'mobx-react'
import { register, registerPhoneVerify } from '@/api/user'

const RegisterForm = props => {
  const { userInfoStore } = useStore()
  const [isSendVerify, setIsSendVerify] = useState(false)
  const [countDown, setCountDown] = useState(5)
  const [form] = Form.useForm()
  const [, forceUpdate] = useState()

  const captchaCallback = res => {
    // * 滑动验证成功回调
    let registerFormValue = form.getFieldsValue()
    let _params = {
      phone: registerFormValue.phone,
      rand: res.randstr,
      ticket: res.ticket
    }
    // * 获取注册手机验证码
    registerPhoneVerify(_params)
      .then(_result => {
        message.success('验证码发送成功！')
        console.log(_result)
      })
      .catch(err => {
        console.log(err, 'err')
      })

    setIsSendVerify(true)
  }
  const registerCaptcha = new window.TencentCaptcha(userInfoStore.appId, captchaCallback)

  const onFinish = () => {
    let registerFormValue = form.getFieldsValue(),
      _registParam = {
        appCode: userInfoStore.appCode,
        password: registerFormValue.password,
        phone: registerFormValue.phone,
        vCode: registerFormValue.Verification
      }
    register(_registParam)
      .then(result => {
        console.log(result)
        message.success('注册成功！')
      })
      .catch(err => {
        console.log(err, 'err')
      })
  }

  const onFinishFailed = () => {}

  const verifyPhone = () => {
    // * 滑动验证
    registerCaptcha.show()
  }

  const gologin = () => {
    props.switchShowBox('login')
    form.resetFields()
  }

  useInterval(
    () => {
      setCountDown(countDown => countDown - 1)
    },
    1000,
    isSendVerify
  )

  useEffect(() => {
    if (countDown === 0) {
      setIsSendVerify(false)
      setCountDown(5)
    }
    forceUpdate({})
  }, [countDown])

  const afterSelector = (
    <Form.Item noStyle shouldUpdate>
      {() => (
        <Button
          type="link"
          block
          disabled={
            !form.isFieldTouched('phone') || form.getFieldError('phone').length || isSendVerify
          }
          onClick={verifyPhone}
        >
          {!isSendVerify ? '获取验证码' : `${countDown}秒后重新获取`}
        </Button>
      )}
    </Form.Item>
  )

  return (
    <RegisterContainer>
      <RegisterTitle>注册</RegisterTitle>
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{
          prefix: '86'
        }}
      >
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
        <Form.Item shouldUpdate>
          {() => (
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              disabled={
                !form.isFieldTouched('phone') ||
                !form.isFieldTouched('password') ||
                !form.isFieldTouched('confirm') ||
                !form.isFieldTouched('Verification') ||
                form.getFieldsError().filter(({ errors }) => errors.length).length
              }
              className="register-button"
            >
              注册
            </Button>
          )}
        </Form.Item>
      </Form>
      <LoginAccount onClick={gologin}>已有账号，直接登录</LoginAccount>
    </RegisterContainer>
  )
}

const RegisterContainer = styled.div`
  width: 420px;
`

const RegisterTitle = styled.h3`
  text-align: center;
  color: #000;
  font-size: 30px;
`

const LoginAccount = styled.div`
  display: flex;
  margin-top: -10px;
  justify-content: flex-end;
  color: #1890ff;
  cursor: pointer;
`

export default observer(RegisterForm)
