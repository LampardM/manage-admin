/*
 * @Description: 创建团队表单
 * @Author: longzhang6
 * @Date: 2020-04-26 09:40:41
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-07-22 14:13:38
 */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import { Button, Form, Input, Select, Space, message } from 'antd'
import PrefixSelector from '@/components/PrefixSelector/PrefixSelector'
import { useStore } from '@/hooks/useStore'
import { useHistory } from 'react-router-dom'
import { useLocalStorageState } from '@umijs/hooks'
import { createOrganization, getOrganizationType } from '@/api/organize'

const { Option } = Select
const { TextArea } = Input

const CreateDepartForm = () => {
  const [form] = Form.useForm()
  const [, forceUpdate] = useState()
  const { userInfoStore } = useStore()
  const [organizeTypes, setOrganizeTypes] = useState([])
  const [curOriganize, setCurOriganize] = useState('')
  const [userOrganizes, setUserOrganizes] = useLocalStorageState('user-organizes')
  const history = useHistory()

  const tailLayout = {
    wrapperCol: {
      offset: 5
    }
  }

  // 获取当前团队类型
  const getCurOrganizeType = () => {
    let _params = {
      timestamp: JSON.stringify(new Date().getTime()),
      token: userInfoStore.token,
      version: userInfoStore.version
    }
    getOrganizationType(_params)
      .then(_result => {
        setOrganizeTypes(_result.data)
        _result.data.length && setCurOriganize(_result.data[0].code)
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    getCurOrganizeType()
  }, [])

  const handleDepartKindChange = value => {
    setCurOriganize(value)
  }

  // 创建团队
  const creatrDepartHandler = () => {
    let createFormValue = form.getFieldsValue(),
      _params = {
        param: {
          contract: createFormValue.connect, // 联系人
          memo: createFormValue.desc, // 备注
          organizeName: createFormValue.name, // 团队名称
          organizeTypeCode: curOriganize, // 团队类型编码
          phone: createFormValue.phone // 手机号
        },
        timestamp: JSON.stringify(new Date().getTime()),
        token: userInfoStore.token,
        version: userInfoStore.version
      }

    createOrganization(_params)
      .then(_result => {
        console.log(_result)
        console.log(userOrganizes, 'userOrganizes')
        let _updateOrganizes = [...userOrganizes]
        _updateOrganizes.splice(-1, 0, _result.data)
        setUserOrganizes(_updateOrganizes)
        userInfoStore.updateUserOrganizes(_updateOrganizes)
        history.push('/home')
        message.success('创建团队成功！')
      })
      .catch(err => {
        console.log(err)
      })
  }

  // 取消创建
  const cancelCreate = () => {
    form.resetFields()
  }

  return (
    <DepartFormCon>
      <FormContainer>
        <Form
          form={form}
          labelCol={{
            span: 5
          }}
          initialValues={{
            prefix: '86'
          }}
        >
          <Form.Item
            name="name"
            label="团队名称"
            rules={[
              {
                required: true,
                message: '请输入团队名称'
              },
              {
                pattern: '^[^ ]+$',
                message: '团队名称不能包含空格'
              }
            ]}
          >
            <Input placeholder="请输入团队名称" />
          </Form.Item>
          <Form.Item
            name="character"
            label="团队类型"
            rules={[
              {
                required: true,
                message: '请选择团队类型'
              }
            ]}
          >
            <>
              <Select
                style={{ width: '100%' }}
                loading={organizeTypes.length === 0}
                onChange={handleDepartKindChange}
                placeholder="请选择团队类型"
                optionLabelProp="label"
                value={curOriganize}
              >
                {organizeTypes.map(type => (
                  <Option key={type.code} value={type.code} label={type.name}>
                    {type.name}
                  </Option>
                ))}
              </Select>
            </>
          </Form.Item>
          <Form.Item
            name="connect"
            label="联系人"
            rules={[
              {
                required: true,
                message: '请输入联系人'
              },
              {
                pattern: '^[^ ]+$',
                message: '请输入联系人姓名'
              }
            ]}
          >
            <Input placeholder="联系人" />
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
          <Form.Item name="desc" label="备注">
            <TextArea placeholder="备注" autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item>
          <Form.Item {...tailLayout} shouldUpdate>
            {() => (
              <Space>
                <Button onClick={cancelCreate}>取消</Button>
                <Button
                  type="primary"
                  onClick={creatrDepartHandler}
                  disabled={
                    !form.isFieldTouched('name') ||
                    !form.isFieldTouched('connect') ||
                    !form.isFieldTouched('phone') ||
                    form.getFieldsError().filter(({ errors }) => errors.length).length
                  }
                >
                  提交申请
                </Button>
              </Space>
            )}
          </Form.Item>
        </Form>
      </FormContainer>
    </DepartFormCon>
  )
}

const DepartFormCon = styled.div`
  margin: 16px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px;
`
const FormContainer = styled.div`
  width: 450px;
`
export default observer(CreateDepartForm)
