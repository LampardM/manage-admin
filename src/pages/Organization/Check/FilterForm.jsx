/**
 * @Desc In User Settings Edit
 * @exports class
 * @Author jieq
 * @Date 2020-04-18 10:41:47
 * @LastEditors jieq
 * @LastEditTime 2020-04-19 00:01:25
 */
/** official */
import React, { useState } from 'react'
import { observer } from 'mobx-react'

/** vendor */
import { Form, Row, Col, Input, Button, Select, DatePicker } from 'antd'

/** custom */
import { Ext } from '../../../utils'
import { useStore } from '@/hooks/useStore'

export default observer(() => {
  const [form] = Form.useForm()
  const { OrganizationCheckStore } = useStore()

  const onFinish = values => {
    console.log('Received values of form: ', values)
    // debugger
    OrganizationCheckStore.setFilters(values)
  }

  return (
    <Form form={form} name="advanced-search" className="advanced-search" onFinish={onFinish}>
      <Row gutter={5}>
        <Col style={{ width: 250 }}>
          <Form.Item name="date">
            <DatePicker.RangePicker />
          </Form.Item>
        </Col>

        <Col style={{ width: 130 }}>
          <Form.Item name="teamName">
            <Input placeholder="请输入团队名称" value={OrganizationCheckStore.teamName} />
          </Form.Item>
        </Col>

        <Col style={{ width: 170 }}>
          <Form.Item name="teamType">
            <Select
              allowClear
              style={{ width: '100%' }}
              placeholder="请选择团队类型"
              value={OrganizationCheckStore.teamName}
            >
              <Select.Option value={OrganizationCheckStore.teamType}>Lucy</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col style={{ width: 150 }}>
          <Form.Item name="name">
            <Input placeholder="请输入联系人姓名" value={OrganizationCheckStore.name} />
          </Form.Item>
        </Col>

        <Col style={{ width: 130 }}>
          <Form.Item name="phone">
            <Input placeholder="请输入手机号码" value={OrganizationCheckStore.phone} />
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
              form.resetFields()
            }}
          >
            重置
          </Button>
        </Col>
      </Row>
    </Form>
  )
})
