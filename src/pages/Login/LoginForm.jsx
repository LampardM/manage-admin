/*
 * @Description: 登录组件
 * @Author: longzhang6
 * @Date: 2020-04-16 22:33:45
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-05-13 22:00:39
 */
import React, { useState, useEffect } from 'react'
import { Form, Input, Select, Button, message } from 'antd'
import styled from 'styled-components'
import useInterval from '@/hooks/useInterval'
import PrefixSelector from '@/components/PrefixSelector/PrefixSelector'
import { useStore } from '@/hooks/useStore'
import { observer } from 'mobx-react'
import { useHistory } from 'react-router-dom'
import { LoginByPassword, loginPhoneVerify, LoginByPhone } from '@/api/user'

const LoginForm = props => {
  const [form] = Form.useForm()
  const { userInfoStore } = useStore()
  const [loginType, setLoginType] = useState('password')
  const [isSendVerify, setIsSendVerify] = useState(false)
  const [countDown, setCountDown] = useState(5)
  const history = useHistory()

  let isLogining = false

  const [loginKindList] = useState([
    {
      type: 'password',
      name: '密码登录'
    },
    {
      type: 'verify',
      name: '验证码登录'
    }
  ])
  const [, forceUpdate] = useState()

  const captchaCallback = res => {
    // * 滑动验证成功回调
    let loginFormValue = form.getFieldsValue()
    // 密码登录
    if (isLogining) {
      isLogining = false // 重置状态
      let _loginByPassParam = {
        appCode: userInfoStore.appCode,
        password: loginFormValue.password,
        phone: loginFormValue.phone,
        rand: res.randstr,
        ticket: res.ticket
      }
      LoginByPassword(_loginByPassParam)
        .then(_result => {
          console.log(_result)
          message.success('登录成功！')
          history.push('/home')
          userInfoStore.toggleLogin(true, _result.data)
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      // 获取手机验证码
      let _params = {
        phone: loginFormValue.phone,
        rand: res.randstr,
        ticket: res.ticket
      }
      // * 获取登录手机验证码
      loginPhoneVerify(_params)
        .then(_result => {
          message.success('验证码发送成功！')
          console.log(_result)
        })
        .catch(err => {
          console.log(err, 'err')
        })
      setIsSendVerify(true)
    }
  }

  const registerCaptcha = new window.TencentCaptcha(userInfoStore.appId, captchaCallback)

  const verifyPhone = () => {
    // * 滑动验证
    registerCaptcha.show()
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

  useEffect(() => {
    form.resetFields()
  }, [loginType])

  const onFinish = () => {
    isLogining = true
    if (loginType === 'password') {
      verifyPhone()
    } else {
      let loginFormValue = form.getFieldsValue(),
        _loginByVerParam = {
          appCode: userInfoStore.appCode,
          phone: loginFormValue.phone,
          validateCode: loginFormValue.Verification
        }
      LoginByPhone(_loginByVerParam)
        .then(_result => {
          console.log(_result)
          message.success('登录成功！')
          history.push('/home')
          userInfoStore.toggleLogin(true, _result.data)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  const onFinishFailed = () => {}

  const register = () => {
    props.switchShowBox('register')
    form.resetFields()
  }

  const forgetPassword = () => {
    props.switchShowBox('forgotpassword')
    form.resetFields()
  }

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

  useEffect(() => {
    forceUpdate({})
  }, [])

  return (
    <LoginContainer>
      <LoginTitle>登录</LoginTitle>
      <SwitchTab>
        {loginKindList.map(kind => (
          <SwitchItem
            key={kind.type}
            curLoginType={loginType}
            switchType={kind.type}
            onClick={() => {
              setLoginType(kind.type)
            }}
          >
            {kind.name}
          </SwitchItem>
        ))}
      </SwitchTab>
      <FormContainer>
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
          {loginType === 'password' ? (
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
          ) : (
            <Form.Item
              name="Verification"
              rules={[
                {
                  required: true,
                  message: '请输入验证码!'
                },
                {
                  pattern: '^[0-9]+$',
                  message: '验证码有误，请重新输入'
                }
              ]}
            >
              <Input placeholder="请输入验证码" size="large" addonAfter={afterSelector} />
            </Form.Item>
          )}
          <Form.Item shouldUpdate>
            {() => (
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                disabled={
                  loginType === 'password'
                    ? !form.isFieldTouched('phone') ||
                      !form.isFieldTouched('password') ||
                      form.getFieldsError().filter(({ errors }) => errors.length).length
                    : !form.isFieldTouched('phone') ||
                      !form.isFieldTouched('Verification') ||
                      form.getFieldsError().filter(({ errors }) => errors.length).length
                }
                className="register-button"
              >
                登录
              </Button>
            )}
          </Form.Item>
        </Form>
        <VerifyForgotAccount>
          <ForgotPassword onClick={forgetPassword}>忘记密码</ForgotPassword>
          <Register onClick={register}>立即注册</Register>
        </VerifyForgotAccount>
      </FormContainer>
    </LoginContainer>
  )
}

const LoginContainer = styled.div`
  width: 420px;
`

const LoginTitle = styled.h3`
  text-align: center;
  color: #000;
  font-size: 30px;
`
const SwitchTab = styled.div`
  display: flex;
  padding: 10px 0;
`

const SwitchItem = styled.span`
  cursor: pointer;
  font-size: 18px;
  margin-right: 5px;
  color: ${props => (props.switchType === props.curLoginType ? '#000' : '#1890ff')};
`

const FormContainer = styled.div``

const VerifyForgotAccount = styled.div`
  display: flex;
  margin-top: -10px;
  justify-content: flex-end;
`
const Register = styled.div`
  color: #1890ff;
  cursor: pointer;
`

const ForgotPassword = styled.div`
  color: #1890ff;
  cursor: pointer;
  margin-right: 20px;
`

export default observer(LoginForm)
