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
import { Row, Col, Menu, Button, Table, Modal, message } from 'antd'
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
/** custom */
import request from '@/utils/request'
import { useStore } from '@/hooks/useStore'
import { getRoleList, enabledRoles, disabledRoles, deleteRoles } from '@/api'

let orgCodes = []
const PAGE_SIZE = 10
const columns = [
  {
    width: 120,
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

const TableData = observer(({ className, filters }) => {
  const { userInfoStore } = useStore()
  const history = useHistory()
  const [data, setData] = useState([])
  const [selectedKeys, setSelectedKeys] = useState([])
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [pagination, setPagination] = useState({ current: 1, pageSize: PAGE_SIZE })

  const { TeamCharacterStore } = useStore()

  useEffect(() => {
    fetch()
  }, [TeamCharacterStore.filters])

  const fetch = async (pageIndex = 0, pageSize = PAGE_SIZE) => {
    setIsTableLoading(true)

    const param = toJS(TeamCharacterStore.filters)

    getRoleList({
      param: {
        pageIndex: pageIndex,
        pageSize: pageSize,
        param: {
          roleName: param.name,
          state: param.status || 'ALL'
        }
      },
      token: userInfoStore.token,
      version: userInfoStore.version,
      timestamp: JSON.stringify(new Date().getTime())
    })
      .then(({ data: { rows, pageIndex, pageSize, total } }) => {
        setData(dataformat(rows))
        setPagination({ current: pageIndex + 1, pageSize, total })
      })
      .finally(() => setIsTableLoading(false))
  }

  const dataformat = dataFormRESTful => {
    return dataFormRESTful.map(it => ({
      id: it.roleCode,
      name: it.roleName,
      comment: it.memo,
      displayStatus: it.displayState,
      isDisable: it.state !== 1
    }))
  }

  const handleTableChange = pagination => {
    fetch(pagination.current - 1, pagination.pageSize)
    setPagination(pagination)
  }

  const addCharacter = () => {
    history.push(`/team/character/add`)
  }

  const doEnable = () => {
    Modal.confirm({
      title: '确认启用?',
      icon: <ExclamationCircleOutlined />,
      content: '是否确认启用所选角色',
      onOk() {
        enabledRoles({
          param: orgCodes,
          token: userInfoStore.token,
          version: userInfoStore.version,
          timestamp: JSON.stringify(new Date().getTime())
        }).then(() => {
          message.success('操作成功')
          fetch()
        })
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  const doDisable = () => {
    Modal.confirm({
      title: '确认禁用?',
      icon: <ExclamationCircleOutlined />,
      content: '是否确认禁用所选角色',
      onOk() {
        disabledRoles({
          param: orgCodes,
          token: userInfoStore.token,
          version: userInfoStore.version,
          timestamp: JSON.stringify(new Date().getTime())
        }).then(() => {
          message.success('操作成功')
          fetch()
        })
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  const doDelete = () => {
    Modal.confirm({
      title: '确认删除?',
      icon: <ExclamationCircleOutlined />,
      content: '是否确认删除所选角色',
      onOk() {
        deleteRoles({
          param: orgCodes,
          token: userInfoStore.token,
          version: userInfoStore.version,
          timestamp: JSON.stringify(new Date().getTime())
        }).then(() => {
          message.success('操作成功')
          fetch()
        })
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  const doEdit = item => {
    history.push(`/team/character/edit/${item.id}`)
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
        onClick={() => {
          orgCodes = selectedKeys
          doEnable()
        }}
        disabled={!selectedKeys.length}
      >
        启用
      </Button>
      <Button
        style={{
          margin: '0 4px'
        }}
        onClick={() => {
          orgCodes = selectedKeys
          doDisable()
        }}
        disabled={!selectedKeys.length}
      >
        禁用
      </Button>
      <Button
        style={{
          margin: '0 4px'
        }}
        onClick={() => {
          orgCodes = selectedKeys
          doDelete()
        }}
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
                <a
                  href="js:void()"
                  onClick={() => {
                    orgCodes = [row.id]
                    doEnable(row)
                  }}
                >
                  启用
                </a>
              ) : (
                <a
                  href="js:void()"
                  onClick={() => {
                    orgCodes = [row.id]
                    doDisable(row)
                  }}
                >
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
                  <Menu.Item
                    key="delete"
                    onClick={() => {
                      orgCodes = [row.id]
                      doDelete(row)
                    }}
                  >
                    删除
                  </Menu.Item>
                </Menu.SubMenu>
              </Menu>
            </>
          )
        })}
        rowKey={(row /*, idx, self*/) => {
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
