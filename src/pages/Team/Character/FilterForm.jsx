/**
 * @Desc In User Settings Edit
 * @exports class
 * @Author jieq
 * @Date 2020-04-26 22:07:38
 * @LastEditors jieq
 * @LastEditTime 2020-04-26 22:14:28
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
  const { TeamCharacterStore } = useStore()

  const onFinish = values => {
    console.log('Received values of form: ', values)
    // debugger
    TeamCharacterStore.setFilters(values)
  }

  return (
    <Form
      form={form}
      onFinish={onFinish}
      name="advanced-search"
      className="advanced-search"
      initialValues={TeamCharacterStore.filters}
    >
      <Row gutter={5}>
        <Col style={{ width: 200 }}>
          <Form.Item name="name">
            <Input placeholder="请输入角色名称" />
          </Form.Item>
        </Col>

        <Col style={{ width: 200 }}>
          <Form.Item name="status">
            <Select allowClear style={{ width: '100%' }} placeholder="请选择状态">
              <Select.Option value="enable">启用</Select.Option>
              <Select.Option value="disable">禁用</Select.Option>
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
              TeamCharacterStore.clearFilters()
            }}
          >
            重置
          </Button>
        </Col>
      </Row>
    </Form>
  )
})
