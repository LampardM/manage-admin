/**
 * @Desc 筛选表单
 * @exports class
 * @Author jieq
 * @Date 2020-04-18 10:41:47
 * @LastEditors jieq
 * @LastEditTime 2020-04-24 02:00:57
 */
/** official */
import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'

/** vendor */
import { Form, Row, Col, Input, Button, Select, DatePicker } from 'antd'

/** custom */
import { Ext } from '@/utils'
import { useStore } from '@/hooks/useStore'
import { getOrganizationType } from '@/api'

export default observer(() => {
  const [form] = Form.useForm()
  const { userInfoStore, OrganizationAuthStore } = useStore()

  const [organizeTypes, setOrganizeTypes] = useState([])

  useEffect(() => {
    getOrganizeTypes()
  }, [])

  const getOrganizeTypes = () => {
    getOrganizationType({
      token: userInfoStore.token,
      version: userInfoStore.version,
      timestamp: JSON.stringify(new Date().getTime())
    }).then(res => {
      setOrganizeTypes(res.data)
    })
  }

  const onFinish = values => {
    console.log('Received values of form: ', values)

    values.minSubmitTime =
      Ext.isArray(values.date) && values.date[0]
        ? `${values.date[0].format('YYYY-MM-DD')} 00:00:00`
        : ''
    values.maxSubmitTime =
      Ext.isArray(values.date) && values.date[1]
        ? `${values.date[1].format('YYYY-MM-DD')} 23:59:59`
        : ''

    OrganizationAuthStore.setFilters(values)
  }
  //   contact: '',
  //   maxSubmitTime: '',
  //   minSubmitTime: '',
  //   orgName: '',
  //   orgTypeCode: '',
  //   phone: '',
  //   submitterName: ''
  return (
    <Form
      form={form}
      name="advanced-search"
      className="advanced-search"
      onFinish={onFinish}
      initialValues={OrganizationAuthStore.filters}
    >
      <Row gutter={5}>
        <Col style={{ width: 250 }}>
          <Form.Item name="date">
            <DatePicker.RangePicker />
          </Form.Item>
        </Col>

        <Col style={{ width: 130 }}>
          <Form.Item name="orgName">
            <Input placeholder="请输入团队名称" value={OrganizationAuthStore.teamName} />
          </Form.Item>
        </Col>

        <Col style={{ width: 170 }}>
          <Form.Item name="orgTypeCode">
            <Select allowClear style={{ width: '100%' }} placeholder="请选择团队类型">
              {organizeTypes.map(it => (
                <Select.Option value={it.code} label={it.name} key={it.code}>
                  {it.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col style={{ width: 150 }}>
          <Form.Item name="contact">
            <Input placeholder="请输入联系人姓名" value={OrganizationAuthStore.name} />
          </Form.Item>
        </Col>

        <Col style={{ width: 130 }}>
          <Form.Item name="phone">
            <Input placeholder="请输入手机号码" value={OrganizationAuthStore.phone} />
          </Form.Item>
        </Col>

        <Col style={{ marginBottom: 24 }}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button
            style={{
              margin: '0 4px'
            }}
            onClick={() => {
              OrganizationAuthStore.clearFilters()
              setTimeout(form.resetFields, 0)
            }}
          >
            重置
          </Button>
        </Col>
      </Row>
    </Form>
  )
})
