/*
 * @Description: 团队转让
 * @Author: longzhang6
 * @Date: 2020-04-26 15:04:10
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-06-28 21:16:28
 */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Row, Col, Form, Button, Input, Space } from 'antd'
import { Ext } from '@/utils'
import useInterval from '@/hooks/useInterval'

const VerifyCurAccountPhone = props => {
  const [form] = Form.useForm()
  const [, forceUpdate] = useState()
  const [isSendVerify, setIsSendVerify] = useState(false)
  const [countDown, setCountDown] = useState(5)

  const verifyCurPhone = () => {
    setIsSendVerify(true)
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

  const nextVerifyNewAccount = () => {
    props.nextVerifyNewAccount()
  }

  return (
    <CurVerifyPhone>
      <Row style={{ marginBottom: '16px' }}>
        <Col>手机号码:</Col>
        <Col>{Ext.parseMobile('18356032765')}</Col>
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

export default VerifyCurAccountPhone
