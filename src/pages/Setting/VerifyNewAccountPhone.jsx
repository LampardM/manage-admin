/*
 * @Description: 团队转让验证新用户
 * @Author: longzhang6
 * @Date: 2020-04-26 15:15:30
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-07-05 22:44:57
 */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Row, Col, Form, Button, Input, Space, message } from 'antd'
import { useStore } from '@/hooks/useStore'
import { getReceivePhoneCode } from '@/api/setting'
import PrefixSelector from '@/components/PrefixSelector/PrefixSelector'
import useInterval from '@/hooks/useInterval'

const VerifyNewAccountPhone = () => {
  const [form] = Form.useForm()
  const [, forceUpdate] = useState()
  const { userInfoStore } = useStore()
  const [isSendVerify, setIsSendVerify] = useState(false)
  const [countDown, setCountDown] = useState(5)

  const captchaCallback = res => {
    console.log(res, 'res')
    let _params = {
      param: {
        phone: form.getFieldValue('phone'),
        rand: res.randstr,
        ticket: res.ticket
      },
      timestamp: JSON.stringify(new Date().getTime()),
      token: userInfoStore.token,
      version: userInfoStore.version
    }
    getReceivePhoneCode(_params)
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
    if (countDown === 0) {
      setIsSendVerify(false)
      setCountDown(5)
    }
    forceUpdate({})
  }, [countDown])

  return (
    <CurVerifyPhone>
      <Form
        form={form}
        initialValues={{
          prefix: '86'
        }}
      >
        <Form.Item
          name="phone"
          label="手机号码"
          style={{ width: '400px' }}
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
          <Input placeholder="请输入手机号码" addonBefore={PrefixSelector} />
        </Form.Item>
        <Row style={{ marginLeft: '14px' }}>
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
                  <Button
                    type="primary"
                    onClick={verifyCurPhone}
                    disabled={
                      !form.isFieldTouched('phone') ||
                      isSendVerify ||
                      form.getFieldError('phone').length
                    }
                  >
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
                disabled={
                  !form.isFieldTouched('verify') ||
                  form.getFieldsError().filter(({ errors }) => errors.length).length
                }
              >
                确定
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

export default VerifyNewAccountPhone
