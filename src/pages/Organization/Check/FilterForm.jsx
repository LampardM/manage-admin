/**
 * @Desc In User Settings Edit
 * @exports class
 * @Author jieq
 * @Date 2020-04-18 10:41:47
 * @LastEditors jieq
 * @LastEditTime 2020-04-18 15:06:56
 */
/** official */
import React, { useState } from 'react'
import { observer } from 'mobx-react'

/** vendor */
import { Form, Row, Col, Input, Button, Select, DatePicker } from 'antd'

const FilterFrom = () => {
  const [form] = Form.useForm()

  const onFinish = values => {
    console.log('Received values of form: ', values)
  }

  return (
    <Form form={form} name="advanced-search" className="advanced-search" onFinish={onFinish}>
      <Row gutter={5}>
        {/* 日期范围选择 */}
        <Col style={{ width: 230 }}>
          <Form.Item name="date">
            <DatePicker.RangePicker />
          </Form.Item>
        </Col>

        <Col style={{ width: 130 }}>
          <Form.Item name="teamName">
            <Input placeholder="请输入团队名称" />
          </Form.Item>
        </Col>

        <Col style={{ width: 170 }}>
          <Form.Item name="teamType">
            <Select placeholder="请选择团队类型" allowClear style={{ width: '100%' }}>
              <Select.Option value="lucy">Lucy</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col style={{ width: 150 }}>
          <Form.Item name="name">
            <Input placeholder="请输入联系人姓名" />
          </Form.Item>
        </Col>

        <Col style={{ width: 130 }}>
          <Form.Item name="phone">
            <Input placeholder="请输入手机号码" />
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
            }}>
            重置
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

export default observer(FilterFrom)
