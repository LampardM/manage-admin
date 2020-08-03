/*
 * @Description: 加入团队通知页
 * @Author: longzhang6
 * @Date: 2020-04-21 10:55:41
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-08-03 22:27:40
 */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import PrefixSelector from '@/components/PrefixSelector/PrefixSelector'
import { Button, Form, Input, Select } from 'antd'
import { isAuthenticated } from '@/utils/session'
import { useHistory, useParams } from 'react-router-dom'

/** custom */
import { joinOrganize, invitationInfo } from '@/api'
import { useStore } from '@/hooks/useStore'

const AddDepartMentNotice = () => {
  let invitationCode = ''
  const { id } = useParams()
  const history = useHistory()
  const [form] = Form.useForm()
  const { userInfoStore } = useStore()
  const [, forceUpdate] = useState()
  const [organize, setOrganize] = useState('')

  const tailLayout = {
    wrapperCol: {
      offset: 5
    }
  }

  useEffect(() => {
    if (!isAuthenticated()) {
      history.push('/login')
    } else {
      getInvitationInfo()
    }
  }, [])

  const getInvitationInfo = () => {
    invitationInfo({
      param: id,
      token: userInfoStore.token,
      version: userInfoStore.version,
      timestamp: JSON.stringify(new Date().getTime())
    }).then(({ data }) => {
      invitationCode = data.invitationCode
      form.setFieldsValue({ name: data.memberName })
      setOrganize(data.organizeName)
    })
  }

  const joinDepartMentHandle = form => {
    console.log(form.name, form.phone)

    joinOrganize({
      param: {
        phone: form.phone,
        invitationCode: invitationCode
      },
      token: userInfoStore.token,
      version: userInfoStore.version,
      timestamp: JSON.stringify(new Date().getTime())
    }).then(() => {
      if (!isAuthenticated()) {
        history.push('/login')
      } else {
        history.push('/home')
      }
    })
  }

  return (
    <div style={{ padding: '0 16 16', marginTop: -16 }}>
      <AddDepartMentNoticeCon>
        <AddDepartContent>
          <RealContent>
            <AddDepartMentTitle>{organize}邀请您加入团队</AddDepartMentTitle>
            <Form
              form={form}
              onFinish={joinDepartMentHandle}
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
                <Input placeholder="请输入姓名" disabled />
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
                <Input placeholder="手机号码" addonBefore={PrefixSelector} />
              </Form.Item>
              {/* <Form.Item
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
                <VerifyContent>
                  <VerifyInput>
                    <Input placeholder="请输入验证码" />
                  </VerifyInput>
                  <Form.Item shouldUpdate>
                    {() => (
                      <Button
                        type="primary"
                        disabled={
                          !form.isFieldTouched('phone') ||
                          form.getFieldError('phone').filter(({ errors }) => errors.length).length
                        }
                      >
                        获取验证码
                      </Button>
                    )}
                  </Form.Item>
                </VerifyContent>
              </Form.Item> */}
              <Form.Item {...tailLayout} shouldUpdate>
                {() => (
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={
                      !form.isFieldTouched('phone') ||
                      !form.isFieldTouched('name') ||
                      // !form.isFieldTouched('verify') ||
                      form.getFieldsError().filter(({ errors }) => errors.length).length
                    }
                  >
                    加入
                  </Button>
                )}
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

const AddDepartContent = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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

const VerifyContent = styled.div`
  display: flex;
`

const VerifyInput = styled.div`
  marign-right: 10px;
`

export default AddDepartMentNotice
