/*
 * @Description: 手机号码前缀
 * @Author: longzhang6
 * @Date: 2020-04-22 00:00:57
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-22 23:29:30
 */
import React from 'react'
import { Form, Select } from 'antd'

const { Option } = Select

const PrefixSelector = (
  <Form.Item name="prefix" noStyle>
    <Select
      style={{
        width: 70
      }}
    >
      <Option value="86">+86</Option>
    </Select>
  </Form.Item>
)

export default PrefixSelector
