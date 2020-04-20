/*
 * @Description: 组织架构Modal
 * @Author: longzhang6
 * @Date: 2020-04-19 17:03:34
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-19 17:10:42
 */
import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Cascader } from 'antd'
import { observer } from 'mobx-react'

const ArchitectureModal = ({ modalShow, modalType, subInfo, onCreate, onCancel }) => {
  const [form] = Form.useForm()
  const [disabled, setDisabled] = useState(true)

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

  useEffect(() => {
    console.log(modalType, 'modalType')
    console.log(subInfo, 'subInfo')
  })

  const setSubmitIsDisabled = () => {
    setDisabled(
      !form.isFieldTouched('department') ||
        !form.isFieldTouched('updepartment') ||
        form.getFieldsError().filter(({ errors }) => errors.length).length
    )
  }

  const onFieldsChange = () => {
    setSubmitIsDisabled()
  }

  return (
    <Modal
      visible={modalShow}
      title={modalType === 'create' ? '添加部门' : '编辑部门'}
      okButtonProps={{
        disabled: disabled
      }}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            form.resetFields()
            onCreate(values)
          })
          .catch(info => {
            console.log('Validate Failed:', info)
          })
      }}
    >
      <Form form={form} name="formModal" onFieldsChange={onFieldsChange}>
        <Form.Item
          name="department"
          label="部门名称"
          rules={[
            {
              required: true,
              message: '请输入部门名称!'
            },
            {
              pattern: '^[\u4e00-\u9fa5_a-zA-Z0-9]+$',
              message: '部门名称由中文，数字，下划线和字母组成'
            },
            {
              max: 25,
              min: 1,
              message: '部门名称长度为1到25位'
            }
          ]}
        >
          <Input placeholder="请输入部门名称" />
        </Form.Item>
        <Form.Item
          name="updepartment"
          label="上级部门"
          rules={[
            {
              required: true,
              message: '请选择上级部门!'
            }
          ]}
        >
          <Cascader
            fieldNames={{ label: 'name', value: 'code', children: 'items' }}
            changeOnSelect
            options={options}
            placeholder="选择上级部门"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default observer(ArchitectureModal)
