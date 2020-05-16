/**
 * @Desc 筛选表单
 * @exports class
 * @Author jieq
 * @Date 2020-04-18 10:41:47
 * @LastEditors jieq
 * @LastEditTime 2020-04-24 22:47:41
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
  const { OrganizationRejectStore } = useStore()

  const onFinish = values => {
    console.log('Received values of form: ', values)
    // debugger
    OrganizationRejectStore.setFilters(values)
  }

  return (
    <Form form={form} name="advanced-search" className="advanced-search" onFinish={onFinish}>
      <Row gutter={5}>
        <Col style={{ width: 250 }}>
          <Form.Item name="date">
            <DatePicker.RangePicker />
          </Form.Item>
        </Col>

        <Col style={{ width: 150 }}>
          <Form.Item name="orderNo">
            <Input placeholder="请输入单号" value={OrganizationRejectStore.orderNo} />
          </Form.Item>
        </Col>

        <Col style={{ width: 150 }}>
          <Form.Item name="teamName">
            <Input placeholder="请输入团队名称" value={OrganizationRejectStore.teamName} />
          </Form.Item>
        </Col>

        <Col style={{ width: 170 }}>
          <Form.Item name="teamType">
            <Select
              allowClear
              style={{ width: '100%' }}
              placeholder="请选择团队类型"
              value={OrganizationRejectStore.teamType}
            >
              <Select.Option value={OrganizationRejectStore.teamType}>Lucy</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col style={{ width: 150 }}>
          <Form.Item name="name">
            <Input placeholder="请输入联系人姓名" value={OrganizationRejectStore.name} />
          </Form.Item>
        </Col>

        <Col style={{ width: 150 }}>
          <Form.Item name="phone">
            <Input placeholder="请输入联系电话" value={OrganizationRejectStore.phone} />
          </Form.Item>
        </Col>

        <Col style={{ width: 150 }}>
          <Form.Item name="handler">
            <Input placeholder="请输入处理人" value={OrganizationRejectStore.handler} />
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
