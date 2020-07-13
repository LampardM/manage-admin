/*
 * @Description: 组织架构Modal
 * @Author: longzhang6
 * @Date: 2020-04-19 17:03:34
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-07-13 22:22:39
 */
import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, TreeSelect } from 'antd'
import { getCurDepartment } from '@/api/department'
import { useStore } from '@/hooks/useStore'
import { useSessionStorage } from 'react-use'
import { observer } from 'mobx-react'
import { getCurDepart } from '@/utils/session'

const ArchitectureModal = ({ modalShow, modalType, subInfo, curInfo, onCreate, onCancel }) => {
  const { userInfoStore } = useStore()
  const [form] = Form.useForm()
  const [disabled, setDisabled] = useState(true)
  const [depart, setDepart] = useState('')
  const [departInfo, setDepartInfo] = useState({})
  const [departList, setDepartList] = useState([])
  const [userOrganizes] = useSessionStorage('user-organizes')

  useEffect(() => {
    if (subInfo) {
      setDepart(subInfo)
      form.setFieldsValue({ updepartment: subInfo })
    } else {
      departList[0] &&
        departList[0].value &&
        form.setFieldsValue({ updepartment: departList[0].value }) &&
        setDepart(departList[0].value)
    }

    if (modalType === 'edit') {
      setDepartInfo(curInfo)
      form.setFieldsValue({ department: curInfo.departmentName })
    } else {
      setDepartInfo({})
      form.setFieldsValue({ department: '' })
    }
  }, [departList])

  useEffect(() => {
    modalShow && form.resetFields() && form.setFieldsValue({ updatedepartment: '' })
    modalShow && getCurDepartmentList(subInfo)
  }, [modalShow])

  const changeFetchDataProp = arr => {
    arr.forEach(_item => {
      _item.value = _item.departmentCode
      _item.title = _item.departmentName

      if (_item.children && _item.children.length > 0) {
        changeFetchDataProp(_item.children)
      }
    })
  }

  // 获取当前组织架构列表
  const getCurDepartmentList = code => {
    let _params = {
      param: {
        baseDepartmentCode: code ? code : '',
        buildChild: true,
        excludeCode: [],
        totalNodeLevel: 6
      },
      timestamp: JSON.stringify(new Date().getTime()),
      token: userInfoStore.token,
      version: userInfoStore.version
    }

    getCurDepartment(_params)
      .then(_result => {
        changeFetchDataProp(_result.data)
        code ? setDepartList(_result.data) : setDepartList(unshiftCurDepart(_result.data))
      })
      .catch(err => {
        console.log(err)
        code ? setDepartList([]) : setDepartList(unshiftCurDepart([]))
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
        departmentCode: organization.code,
        departmentName: organization.name,
        value: organization.code,
        title: organization.name,
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
      getContainer={false}
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
            onCreate(values, subInfo, curInfo)
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
          updepartment: depart,
          department: departInfo.departmentName
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
