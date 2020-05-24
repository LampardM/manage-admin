/**
 * @Desc 查询表单
 * @exports class
 * @Author jieq
 * @Date 2020-04-18 10:41:47
 * @LastEditors jieq
 * @LastEditTime 2020-04-26 00:11:09
 */
/** official */
import React from 'react'
import { observer } from 'mobx-react'

/** vendor */
import { Form, Row, Col, Input, Button, Select } from 'antd'

/** custom */
import { useStore } from '@/hooks/useStore'

export default observer(() => {
  const [form] = Form.useForm()
  const { OrganizationApproveStore } = useStore()

  const onFinish = values => {
    console.log('Received values of form: ', values)
    OrganizationApproveStore.setFilters(values)
  }
  // phone: '',
  // contact: '',
  // orgName: '',
  // orgTypeCode: '',
  // maxSubmitTime: '',
  // minSubmitTime: '',
  // submitterName: '',
  return (
    <Form
      form={form}
      onFinish={onFinish}
      name="advanced-search"
      className="advanced-search"
      initialValues={OrganizationApproveStore.filters}
    >
      <Row gutter={5}>
        <Col style={{ width: 160 }}>
          <Form.Item name="teamNo">
            <Input placeholder="请输入团队号" />
          </Form.Item>
        </Col>

        <Col style={{ width: 160 }}>
          <Form.Item name="teamName">
            <Input placeholder="请输入团队名称" />
          </Form.Item>
        </Col>

        <Col style={{ width: 150 }}>
          <Form.Item name="name">
            <Input placeholder="请输入联系人姓名" />
          </Form.Item>
        </Col>

        <Col style={{ width: 130 }}>
          <Form.Item name="phone">
            <Input placeholder="请输入联系电话" />
          </Form.Item>
        </Col>

        <Col style={{ width: 170 }}>
          <Form.Item name="status">
            <Select allowClear style={{ width: '100%' }} placeholder="请选择状态">
              <Select.Option value={'enable'}>启用</Select.Option>
              <Select.Option value={'disable'}>禁用</Select.Option>
            </Select>
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
              OrganizationApproveStore.clearFilters()
            }}
          >
            重置
          </Button>
        </Col>
      </Row>
    </Form>
  )
})
