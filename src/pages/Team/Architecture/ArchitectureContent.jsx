/*
 * @Description: 组织架构内容
 * @Author: longzhang6
 * @Date: 2020-04-18 15:46:55
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-19 16:22:32
 */
import React, { useState, useEffect } from 'react'
import { Button, Modal, Form, Input, Cascader } from 'antd'
import { Tree } from 'element-react'
import { observer } from 'mobx-react'
import styled from 'styled-components'

const treeData = [
  {
    id: 1,
    label: '一级 1',
    children: [
      {
        id: 4,
        label: '二级 1-1',
        children: [
          {
            id: 9,
            label: '三级 1-1-1'
          },
          {
            id: 10,
            label: '三级 1-1-2'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    label: '一级 2',
    children: [
      {
        id: 5,
        label: '二级 2-1'
      },
      {
        id: 6,
        label: '二级 2-2'
      }
    ]
  },
  {
    id: 3,
    label: '一级 3',
    children: [
      {
        id: 7,
        label: '二级 3-1'
      },
      {
        id: 8,
        label: '二级 3-2'
      }
    ]
  }
]

const options = {
  children: 'children',
  label: 'label'
}

const ArchitectureContent = () => {
  const [defaultAllExpand, setDefaultAllExpand] = useState(true)
  const [recursionResult, setRecursionResult] = useState([])
  const [reLoadTree, setReLoadTree] = useState(false)
  const [modalShow, setModalShow] = useState(false)

  const recursionExpandKeys = (arr, result) => {
    arr.forEach(element => {
      let exitIdx = result.findIndex(key => key === element.key)
      if (exitIdx === -1) {
        result.push(element.key)
      }

      if (element.children) {
        recursionExpandKeys(element.children, result)
      }
    })
    return result
  }

  useEffect(() => {
    setRecursionResult(treeData)
  })

  // TODO 后期补全
  const openOrCloseAllNode = () => {
    setDefaultAllExpand(!defaultAllExpand)
    setReLoadTree(!reLoadTree)
  }

  const onNodeClicked = (nodeModel, node) => {
    // nodeModel = true
  }

  const addChildDepartment = (store, data) => {
    console.log('addChildDepartment', store, data)
  }

  const editCurDepartment = () => {
    console.log('editCurDepartment')
  }

  const deleteCurDepartment = () => {
    console.log('editCurDepartment')
  }

  const addDepartment = () => {
    setModalShow(true)
  }

  const modalHandleOk = () => {
    setModalShow(false)
  }

  const modalHandleCancel = () => {
    setModalShow(false)
  }

  // Tree自定义内容
  const renderContent = (nodeModel, data, store) => {
    return (
      <span>
        <span>
          <span>{data.label}</span>
        </span>
        <span style={{ float: 'right', marginRight: '20px' }}>
          <span
            size="mini"
            onClick={() => addChildDepartment(store, data)}
            style={{ padding: '5px', color: '#1890ff' }}
          >
            添加子部门
          </span>
          <span
            size="mini"
            onClick={() => editCurDepartment(store, data)}
            style={{ padding: '5px', color: '#1890ff' }}
          >
            编辑
          </span>
          <span
            size="mini"
            onClick={() => deleteCurDepartment(store, data)}
            style={{ padding: '5px', color: '#1890ff' }}
          >
            删除
          </span>
        </span>
      </span>
    )
  }

  const CollectionCreateForm = ({ modalShow, onCreate, onCancel }) => {
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

    useEffect(() => {})

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
        title="创建部门"
        onCancel={onCancel}
        okButtonProps={{
          disabled: disabled
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

  return (
    <ArchitectureContainer>
      <CollectionCreateForm
        modalShow={modalShow}
        onCancel={modalHandleCancel}
        onCreate={modalHandleOk}
      />
      <ArchitectureTitle>
        {/* <OpenAll onClick={openOrCloseAllNode}>{defaultAllExpand ? '全部收起' : '全部展开'}</OpenAll> */}
        <Button type="primary" onClick={addDepartment}>
          添加部门
        </Button>
      </ArchitectureTitle>
      <ArchitectureMain>
        <Tree
          data={recursionResult}
          options={options}
          nodeKey="id"
          defaultExpandAll={defaultAllExpand}
          expandOnClickNode={false}
          onNodeClicked={onNodeClicked}
          renderContent={(...args) => renderContent(...args)}
        />
      </ArchitectureMain>
    </ArchitectureContainer>
  )
}

const ArchitectureContainer = styled.div`
  margin: 16px;
  background: #fff;
`

const ArchitectureTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
`

const OpenAll = styled.span`
  cursor: pointer;
`

const ArchitectureMain = styled.div`
  padding: 10px;
`

export default observer(ArchitectureContent)
