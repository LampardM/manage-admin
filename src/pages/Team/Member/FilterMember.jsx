/*
 * @Description: 筛选成员
 * @Author: longzhang6
 * @Date: 2020-04-19 18:42:40
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-07-12 12:54:04
 */
import React from 'react'
import styled from 'styled-components'
import { Form, Row, Col, Input, Button, Select, Cascader } from 'antd'

const FilterMember = () => {
  const [form] = Form.useForm()
  const options = [
    {
      code: 'zhejiang',
      name: 'Zhejiang',
      items: [
        {
          code: 'hangzhou',
          name: 'Hangzhou',
          items: [
            {
              code: 'xihu',
              name: 'West Lake'
            }
          ]
        }
      ]
    },
    {
      code: 'jiangsu',
      name: 'Jiangsu',
      items: [
        {
          code: 'nanjing',
          name: 'Nanjing',
          items: [
            {
              code: 'zhonghuamen',
              name: 'Zhong Hua Men'
            }
          ]
        }
      ]
    }
  ]

  return (
    <FilterMemberCon>
      <Form form={form} name="member">
        <Row gutter={5}>
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

          <Col style={{ width: 130 }}>
            <Form.Item name="characterName">
              <Input placeholder="请选择角色" />
            </Form.Item>
          </Col>

          <Col style={{ width: 170 }}>
            <Form.Item name="departmeName">
              <Cascader
                fieldNames={{ label: 'name', value: 'code', children: 'items' }}
                changeOnSelect
                options={options}
                placeholder="请选择部门"
              />
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
    </FilterMemberCon>
  )
}

const FilterMemberCon = styled.div``

export default FilterMember
