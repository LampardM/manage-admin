/*
 * @Description: 团队转让
 * @Author: longzhang6
 * @Date: 2020-04-26 15:04:10
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-07-08 22:57:58
 */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Row, Col, Form, Button, Input, Space, message } from 'antd'
import { useStore } from '@/hooks/useStore'
import { getDepartmentPhone, getTransPhoneCode, submitTransDepart } from '@/api/setting'
import { Ext } from '@/utils'
import { observer } from 'mobx-react'
import useInterval from '@/hooks/useInterval'

const VerifyCurAccountPhone = props => {
  const [form] = Form.useForm()
  const [, forceUpdate] = useState()
  const { userInfoStore, SettingStore } = useStore()
  const [isSendVerify, setIsSendVerify] = useState(false)
  const [countDown, setCountDown] = useState(5)
  const [curPhone, setCurPhone] = useState('')

  const captchaCallback = res => {
    console.log(res, 'res')
    if (!res.randstr || !res.ticket) return
    let _params = {
      param: {
        phone: curPhone,
        rand: res.randstr,
        ticket: res.ticket
      },
      timestamp: JSON.stringify(new Date().getTime()),
      token: userInfoStore.token,
      version: userInfoStore.version
    }
    getTransPhoneCode(_params)
      .then(_result => {
        message.success('验证码发送成功！')
        console.log(_result)
        setIsSendVerify(true)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const registerCaptcha = new window.TencentCaptcha(userInfoStore.appId, captchaCallback)

  const verifyCurPhone = () => {
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
    getCurDepartPhone()
  }, [])

  useEffect(() => {
    if (countDown === 0) {
      setIsSendVerify(false)
      setCountDown(5)
    }
    forceUpdate({})
  }, [countDown])

  const nextVerifyNewAccount = () => {
    let _params = {
      param: {
        phone: curPhone,
        sms: form.getFieldValue('verify')
      },
      timestamp: JSON.stringify(new Date().getTime()),
      token: userInfoStore.token,
      version: userInfoStore.version
    }
    submitTransDepart(_params)
      .then(_result => {
        SettingStore.setTranscode(_result.data)
        props.nextVerifyNewAccount()
      })
      .catch(err => {
        console.log(err)
      })
  }

  const getCurDepartPhone = () => {
    let _params = {
      timestamp: JSON.stringify(new Date().getTime()),
      token: userInfoStore.token,
      version: userInfoStore.version
    }

    getDepartmentPhone(_params)
      .then(_result => {
        setCurPhone(_result.data)
      })
      .catch(err => console.log(err))
  }

  return (
    <CurVerifyPhone>
      <Row style={{ marginBottom: '16px' }}>
        <Col>手机号码:</Col>
        <Col>{Ext.parseMobile(curPhone)}</Col>
      </Row>
      <Form form={form}>
        <Row>
          <Space>
            <Col>
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
                <Input placeholder="请输入验证码" />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item shouldUpdate>
                {() => (
                  <Button type="primary" onClick={verifyCurPhone} disabled={isSendVerify}>
                    {!isSendVerify ? '获取验证码' : `${countDown}秒后重新获取`}
                  </Button>
                )}
              </Form.Item>
            </Col>
          </Space>
        </Row>
        <Row justify={'center'} style={{ marginTop: '20px' }}>
          <Form.Item shouldUpdate>
            {() => (
              <Button
                type="primary"
                onClick={nextVerifyNewAccount}
                disabled={
                  !form.isFieldTouched('verify') ||
                  form.getFieldsError().filter(({ errors }) => errors.length).length
                }
              >
                下一步
              </Button>
            )}
          </Form.Item>
        </Row>
      </Form>
    </CurVerifyPhone>
  )
}

const CurVerifyPhone = styled.div`
  background: #fff;
  padding: 16px;
  width: 450px;
`

export default observer(VerifyCurAccountPhone)
