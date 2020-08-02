/*
 * @Description: 登录组件
 * @Author: longzhang6
 * @Date: 2020-04-16 22:33:45
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-08-02 20:41:14
 */
import React, { useState, useEffect } from 'react'
import { Form, Input, Button, message } from 'antd'
import styled from 'styled-components'
import useInterval from '@/hooks/useInterval'
import PrefixSelector from '@/components/PrefixSelector/PrefixSelector'
import { useStore } from '@/hooks/useStore'
import { observer } from 'mobx-react'
import { useHistory } from 'react-router-dom'
import { useLocalStorageState } from '@umijs/hooks'
import { setNickName, setCurDepart } from '@/utils/session'
import { switchDepartment } from '@/api/department'
import { LoginByPassword, loginPhoneVerify, LoginByPhone } from '@/api/user'

const LoginForm = props => {
  const [form] = Form.useForm()
  const { userInfoStore } = useStore()
  const [loginType, setLoginType] = useState('password')
  const [isSendVerify, setIsSendVerify] = useState(false)
  const [countDown, setCountDown] = useState(60)
  const [disLogin, setDisLogin] = useState(false)
  const [userOrganizes, setUserOrganizes] = useLocalStorageState('user-organizes', []) // 防止页面刷新左侧团队列表被重置
  const [userMenus, setUserMenus] = useLocalStorageState('user-menus', []) // 防止页面刷新左侧团队列表被重置
  const [isLogined, setIsLogined] = useState(false)

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
    if (res.ret === 2) {
      setDisLogin(false)
    }
    if (!res.randstr || !res.ticket) return
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
          console.log(_result, 'login success')
          userInfoStore.toggleLogin(true, _result.data)
          setNickName(_result.data.nick)
          _result.data.organizes.push({
            code: 'create',
            name: '创建团队',
            selected: false
          })
          setUserOrganizes(_result.data.organizes)
          userInfoStore.updateUserOrganizes(_result.data.organizes)
          let _initSelectedKeyIdx = _result.data.organizes.findIndex(org => {
            return org.selected
          })
          if (_initSelectedKeyIdx !== -1) {
            setCurDepart([_result.data.organizes[_initSelectedKeyIdx].code])
            let _params = {
              param: _result.data.organizes[_initSelectedKeyIdx].code,
              timestamp: JSON.stringify(new Date().getTime()),
              token: _result.data.token,
              version: userInfoStore.version
            }
            // 登录切换当前团队
            switchDepartment(_params)
              .then(_result => {
                console.log(_result)
                setDisLogin(false)
                setUserMenus(_result.data.menus)
                setNickName(_result.data.nick)
                setIsLogined(true)
                message.success('登录成功！')
              })
              .catch(err => {
                console.log(err)
              })
          } else {
            setDisLogin(false)
            setUserMenus(_result.data.menus)
            setIsLogined(true)
            message.success('登录成功！')
          }
        })
        .catch(err => {
          console.log(err)
          setDisLogin(false)
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
          setDisLogin(false)
          console.log(_result)
        })
        .catch(err => {
          console.log(err, 'err')
          setDisLogin(false)
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
      setCountDown(60)
    }
    forceUpdate({})
  }, [countDown])

  useEffect(() => {
    form.resetFields()
  }, [loginType])

  useEffect(() => {
    if (isLogined) {
      history.push('/home')
    }
  }, [isLogined])

  const onFinish = () => {
    setDisLogin(true)
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
          console.log(_result, 'login success')
          userInfoStore.toggleLogin(true, _result.data)
          _result.data.organizes.push({
            code: 'create',
            name: '创建团队',
            selected: false
          })
          setUserOrganizes(_result.data.organizes)
          userInfoStore.updateUserOrganizes(_result.data.organizes)
          setNickName(_result.data.nick)
          let _initSelectedKeyIdx = _result.data.organizes.findIndex(org => {
            return org.selected
          })
          if (_initSelectedKeyIdx !== -1) {
            setCurDepart([_result.data.organizes[_initSelectedKeyIdx].code])
            // 登录切换当前团队
            let _params = {
              param: _result.data.organizes[_initSelectedKeyIdx].code,
              timestamp: JSON.stringify(new Date().getTime()),
              token: _result.data.token,
              version: userInfoStore.version
            }
            switchDepartment(_params)
              .then(_result => {
                setDisLogin(false)
                setUserMenus(_result.data.menus)
                setNickName(_result.data.nick)
                setIsLogined(true)
                message.success('登录成功！')
                console.log(_result)
              })
              .catch(err => {
                console.log(err)
              })
          } else {
            setDisLogin(false)
            setIsLogined(true)
            setUserMenus(_result.data.menus)
            message.success('登录成功！')
          }
        })
        .catch(err => {
          console.log(err)
          setDisLogin(false)
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
                      form.getFieldsError().filter(({ errors }) => errors.length).length ||
                      disLogin
                    : !form.isFieldTouched('phone') ||
                      !form.isFieldTouched('Verification') ||
                      form.getFieldsError().filter(({ errors }) => errors.length).length ||
                      disLogin
                }
                className="register-button"
              >
                登录{disLogin}
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
