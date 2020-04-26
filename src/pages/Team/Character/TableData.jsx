/**
 * @Desc In User Settings Edit
 * @exports class
 * @Author jieq
 * @Date 2020-04-26 22:08:48
 * @LastEditors jieq
 * @LastEditTime 2020-04-26 22:39:18
 */

/** official */
import { toJS } from 'mobx'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import { useHistory } from 'react-router-dom'
import React, { useState, useEffect } from 'react'

/** vendor */
import { Row, Col, Menu, Button, Table, Modal } from 'antd'
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
/** custom */
import request from '@/utils/request'
import { useStore } from '@/hooks/useStore'

//表头
const columns = [
  {
    width: 100,
    title: '角色',
    dataIndex: 'name',
    ellipsis: true,
    textWrap: 'word-break'
  },
  {
    width: 120,
    title: '状态',
    dataIndex: 'displayStatus',
    ellipsis: true,
    textWrap: 'word-break'
  },
  {
    title: '备注',
    dataIndex: 'comment',
    ellipsis: true,
    textWrap: 'word-break'
  }
]

const TableData = observer(({ className, filters, go }) => {
  const history = useHistory()
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({})
  const [selectedKeys, setSelectedKeys] = useState([])
  const [isTableLoading, setIsTableLoading] = useState(true)

  const { TeamCharacterStore } = useStore()

  useEffect(() => {
    fetch(toJS(TeamCharacterStore.filters))
  }, [TeamCharacterStore.filters])

  const fetch = async (params = {}) => {
    setIsTableLoading(true)
    console.log('fetch', params)
    setTimeout(() => {
      setData([
        {
          id: 1,
          name: '管理员',
          status: 'enable',
          displayStatus: '启用',
          comment: '这是一条备注这是一条备注这是一条备注这是一条备注这是一条备注这是一条备注'
        }
      ])
      setIsTableLoading(false)
    }, 1000)
  }

  const dataformat = dataFormRESTful => {
    return dataFormRESTful.map(it => ({
      ...it
    }))
  }

  const handleTableChange = () => {}

  const addCharacter = () => {
    history.push(`/team/character/add`)
  }

  const doEnable = item => {
    Modal.confirm({
      title: '确认启用?',
      icon: <ExclamationCircleOutlined />,
      content: '是否确认启用所选角色',
      onOk() {
        console.log('启用', selectedKeys, item)
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  const doDisable = item => {
    Modal.confirm({
      title: '确认禁用?',
      icon: <ExclamationCircleOutlined />,
      content: '是否确认禁用所选角色',
      onOk() {
        console.log('禁用', selectedKeys, item)
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  const doDelete = item => {
    Modal.confirm({
      title: '确认删除?',
      icon: <ExclamationCircleOutlined />,
      content: '是否确认删除所选角色',
      onOk() {
        console.log('删除', selectedKeys, item)
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  const doEdit = item => {
    history.push(`/team/character/edit?id=${3}`)
  }

  const optArea = () => (
    <>
      <Button type="primary" onClick={addCharacter}>
        添加角色
      </Button>
      <Button
        style={{
          margin: '0 4px'
        }}
        onClick={doEnable}
        disabled={!selectedKeys.length}
      >
        启用
      </Button>
      <Button
        style={{
          margin: '0 4px'
        }}
        onClick={doDisable}
        disabled={!selectedKeys.length}
      >
        禁用
      </Button>
      <Button
        style={{
          margin: '0 4px'
        }}
        onClick={doDelete}
        disabled={!selectedKeys.length}
      >
        删除
      </Button>
    </>
  )

  return (
    <div className={className}>
      <Row>
        <Col>{optArea()}</Col>
      </Row>

      <Table
        style={{ marginTop: 24 }}
        columns={columns.concat({
          title: '操作',
          dataIndex: 'action',
          width: 130,
          render: (value, row, index) => (
            <>
              {row.isDisable ? (
                <a href="js:void()" onClick={() => doEnable(row)}>
                  启用
                </a>
              ) : (
                <a href="js:void()" onClick={() => doDisable(row)}>
                  禁用
                </a>
              )}
              <Menu className="custom-menu-item" mode="horizontal">
                <Menu.SubMenu
                  title={
                    <>
                      更多
                      <DownOutlined />
                    </>
                  }
                >
                  <Menu.Item key="edit" onClick={() => doEdit(row)}>
                    编辑
                  </Menu.Item>
                  <Menu.Item key="detail" disabled>
                    详情
                  </Menu.Item>
                  <Menu.Item key="delete" onClick={() => doDelete(row)}>
                    删除
                  </Menu.Item>
                </Menu.SubMenu>
              </Menu>
            </>
          )
        })}
        rowKey={(row, idx, self) => {
          return row.id
        }}
        dataSource={data}
        pagination={pagination}
        loading={isTableLoading}
        onChange={handleTableChange}
        rowSelection={{
          onChange: (selectedKeys, selectedItems) => {
            console.log(`selectedRowKeys: ${selectedKeys}`, 'selectedRows: ', selectedItems)
            setSelectedKeys(selectedKeys)
          }
        }}
      />
    </div>
  )
})

export default styled(TableData)`
  .action-item {
    padding: 0 !important;
  }
  .ant-menu-submenu-title {
    color: #1890ff;
    margin: 0 !important;
    padding: 0 !important;
    height: auto !important;
    width: initial !important;
    line-height: initial !important;
  }
  .ant-menu {
    background-color: transparent !important;
    &::after {
      content: none;
    }
  }
  .ant-menu-submenu {
    top: 0 !important;
    margin-top: 0 !important;
    border-bottom: 0 !important;
    transition: initial !important;
    vertical-align: initial !important;
    &:hover {
      color: inherit !important;
      border-bottom: 0 !important;
    }
  }
  .ant-menu-submenu-arrow {
    display: none;
  }
  .ant-menu-horizontal {
    border-bottom: 0 !important;
    margin-left: 10px !important;
    line-height: inherit !important;
    display: inline-block !important;
  }
`
