/*
 * @Description: 组织架构Modal
 * @Author: longzhang6
 * @Date: 2020-04-19 17:03:34
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-06-14 18:54:45
 */
import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, TreeSelect } from 'antd'
import { getCurDepartment } from '@/api/department'
import { useStore } from '@/hooks/useStore'
import { useSessionStorage } from 'react-use'
import { observer } from 'mobx-react'
import { getCurDepart } from '@/utils/session'

const ArchitectureModal = ({ modalShow, modalType, subInfo, onCreate, onCancel }) => {
  const { userInfoStore } = useStore()
  const [form] = Form.useForm()
  const [disabled, setDisabled] = useState(true)
  const [depart, setDepart] = useState('')
  const [departList, setDepartList] = useState([])
  const [userOrganizes] = useSessionStorage('user-organizes')

  useEffect(() => {
    getCurDepartmentList()
  }, [])

  useEffect(() => {
    departList[0] && setDepart(departList[0].value)
  }, [departList])

  // 获取当前组织架构列表
  const getCurDepartmentList = () => {
    let _params = {
      timestamp: JSON.stringify(new Date().getTime()),
      token: userInfoStore.token,
      version: userInfoStore.version
    }

    getCurDepartment(_params)
      .then(_result => {
        setDepartList(unshiftCurDepart(_result))
      })
      .catch(err => {
        console.log(err)
        setDepartList(unshiftCurDepart([]))
      })
  }

  // 将当前团队补到首层
  const unshiftCurDepart = data => {
    let _curRoot, _curRootResult
    _curRoot = userOrganizes.filter(organization => {
      return organization.code === getCurDepart()
    })

    _curRootResult = _curRoot.map(organization => {
      return {
        value: organization.code,
        title: organization.name,
        parentCode: '',
        children: data
      }
    })

    return _curRootResult
  }

  const setSubmitIsDisabled = () => {
    setDisabled(
      !form.isFieldTouched('department') ||
        !form.getFieldValue('updepartment') ||
        form.getFieldsError().filter(({ errors }) => errors.length).length
    )
  }

  const onFieldsChange = () => {
    setSubmitIsDisabled()
  }

  const onChange = value => {
    setDepart(value)
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
      <Form
        form={form}
        name="formModal"
        onFieldsChange={onFieldsChange}
        initialValues={{
          updepartment: depart
        }}
      >
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
          <TreeSelect
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={departList}
            placeholder="Please select"
            value={depart}
            treeDefaultExpandAll
            onChange={onChange}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default observer(ArchitectureModal)
