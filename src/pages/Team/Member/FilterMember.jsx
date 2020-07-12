/*
 * @Description: 筛选成员
 * @Author: longzhang6
 * @Date: 2020-04-19 18:42:40
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-07-12 15:39:15
 */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useStore } from '@/hooks/useStore'
import { Form, Row, Col, Input, Button, Select } from 'antd'

const FilterMember = props => {
  const [form] = Form.useForm()
  const { MemberStore } = useStore()
  const { curselect } = props

  // const [curCharacter, setCurCharacter] = useState([])
  // const [characterList, setCharacterList] = useState([])
  // const [department, setDepartment] = useState([])

  // const options = [
  //   {
  //     code: 'zhejiang',
  //     name: 'Zhejiang',
  //     items: [
  //       {
  //         code: 'hangzhou',
  //         name: 'Hangzhou',
  //         items: [
  //           {
  //             code: 'xihu',
  //             name: 'West Lake'
  //           }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     code: 'jiangsu',
  //     name: 'Jiangsu',
  //     items: [
  //       {
  //         code: 'nanjing',
  //         name: 'Nanjing',
  //         items: [
  //           {
  //             code: 'zhonghuamen',
  //             name: 'Zhong Hua Men'
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // ]

  // useEffect(() => {
  //   // getCurRoleList()
  //   // getCurDepartmentList()
  // }, [])

  // const getCurRoleList = () => {
  //   let _params = {
  //     param: {
  //       pageSize: 100,
  //       pageIndex: 0,
  //       param: {
  //         roleName: '',
  //         state: 'ENABLED'
  //       }
  //     },
  //     timestamp: JSON.stringify(new Date().getTime()),
  //     token: userInfoStore.token,
  //     version: userInfoStore.version
  //   }
  //   getRoleList(_params)
  //     .then(_result => {
  //       setCharacterList(_result.data.rows)
  //     })
  //     .catch(err => console.log(err))
  // }

  // const deleteUselessChildren = arr => {
  //   arr.forEach(_item => {
  //     if (_item.children && _item.children.length === 0) {
  //       delete _item.children
  //     } else {
  //       deleteUselessChildren(_item.children)
  //     }
  //   })
  // }

  // const countDepartLevel = (arr, level = 0) => {
  //   arr.forEach(_item => {
  //     _item.level = level
  //     if (_item.children) {
  //       countDepartLevel(_item.children, level + 1)
  //     }
  //   })
  // }

  // const changeFetchDataProp = arr => {
  //   arr.forEach(_item => {
  //     _item.value = _item.departmentCode
  //     _item.title = _item.departmentName

  //     if (_item.children && _item.children.length > 0) {
  //       changeFetchDataProp(_item.children)
  //     }
  //   })
  // }

  // const getCurDepartmentList = () => {
  //   let _params = {
  //     param: {
  //       baseDepartmentCode: '',
  //       buildChild: false,
  //       excludeCode: [],
  //       totalNodeLevel: 6
  //     },
  //     timestamp: JSON.stringify(new Date().getTime()),
  //     token: userInfoStore.token,
  //     version: userInfoStore.version
  //   }

  //   getCurDepartment(_params)
  //     .then(_result => {
  //       deleteUselessChildren(_result.data)
  //       countDepartLevel(_result.data)
  //       changeFetchDataProp(_result.data)
  //       setDepartment(_result.data)
  //       console.log(_result.data, 'department')
  //     })
  //     .catch(err => console.log(err))
  // }

  // const selectCurdepartment = value => {}

  // const handleCharacterChange = value => {
  //   setCurCharacter(value)
  // }

  useEffect(() => {
    form.resetFields()
    MemberStore.clearFilters()
  }, [curselect])

  const onFinish = values => {
    console.log('Received values of form: ', values)
    MemberStore.setFilters({ contact: values.name, phone: values.phone })
  }

  return (
    <FilterMemberCon>
      <Form form={form} name="member" onFinish={onFinish}>
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

          {/* <Col style={{ width: 130 }}>
            <Form.Item name="characterName">
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="请选择角色"
                onChange={handleCharacterChange}
              >
                {characterList.map(d => (
                  <Option key={d.roleCode}>{d.roleName}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col style={{ width: 170 }}>
            <Form.Item name="departmeName">
              <TreeSelect
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={department}
                onSelect={selectCurdepartment}
                allowClear
                placeholder="请选择所属部门"
                treeDefaultExpandAll
              />
            </Form.Item>
          </Col> */}

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
                MemberStore.clearFilters()
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
