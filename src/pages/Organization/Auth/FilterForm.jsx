/**
 * @Desc 筛选表单
 * @exports class
 * @Author jieq
 * @Date 2020-04-18 10:41:47
 * @LastEditors jieq
 * @LastEditTime 2020-04-24 02:00:57
 */
/** official */
import React from 'react'
import { observer } from 'mobx-react'

/** vendor */
import { Form, Row, Col, Input, Button, Select, DatePicker } from 'antd'

/** custom */
import { useStore } from '@/hooks/useStore'

export default observer(() => {
  const [form] = Form.useForm()
  const { OrganizationAuthStore } = useStore()

  const onFinish = values => {
    console.log('Received values of form: ', values)
    // debugger
    OrganizationAuthStore.setFilters(values)
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
            <Input placeholder="请输入团队名称" value={OrganizationAuthStore.teamName} />
          </Form.Item>
        </Col>

        <Col style={{ width: 170 }}>
          <Form.Item name="teamType">
            <Select
              allowClear
              style={{ width: '100%' }}
              placeholder="请选择团队类型"
              value={OrganizationAuthStore.teamType}
            >
              <Select.Option value="lucy">Lucy</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col style={{ width: 150 }}>
          <Form.Item name="name">
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
