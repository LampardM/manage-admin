/**
 * @Desc 列表数据
 * @exports class
 * @Author jieq
 * @Date 2020-04-18 10:41:52
 * @LastEditors jieq
 * @LastEditTime 2020-04-26 00:22:51
 */
/** official */
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import React, { useState, useEffect } from 'react'

/** vendor */
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Row, Col, Button, Table, Menu, Modal, message } from 'antd'

/** custom */
import { Ext } from '../../../utils'
import { useStore } from '@/hooks/useStore'
import { queryApprovaledList, updateEnabled } from '@/api'

const PAGE_SIZE = 10

//表头
const columns = [
  {
    title: '团队编号',
    dataIndex: 'id',
    ellipsis: true,
    textWrap: 'word-break'
  },
  {
    title: '团队名称',
    dataIndex: 'teamName',
    ellipsis: true,
    textWrap: 'word-break'
  },
  {
    title: '团队类型',
    width: 100,
    dataIndex: 'teamType',
    ellipsis: true,
    textWrap: 'word-break'
  },
  {
    title: '联系人',
    width: 100,
    dataIndex: 'name',
    ellipsis: true,
    textWrap: 'word-break'
  },
  {
    title: '手机号码',
    width: 140,
    dataIndex: 'phone',
    ellipsis: true,
    textWrap: 'word-break'
  },
  {
    title: '状态',
    width: 65,
    dataIndex: 'status',
    ellipsis: true,
    textWrap: 'word-break'
  }
]

let orgCodes = []

const TableData = observer(({ className, filters }) => {
  const history = useHistory()
  const { OrganizationApproveStore } = useStore()
  const { userInfoStore } = useStore('userInfoStore')

  const [data, setData] = useState([])
  const [selectedKeys, setSelectedKeys] = useState([])
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [pagination, setPagination] = useState({ current: 1, pageSize: PAGE_SIZE })

  useEffect(() => {
    fetch()
  }, [OrganizationApproveStore.filters, pagination.current])

  const fetch = async () => {
    setIsTableLoading(true)

    const param = toJS(OrganizationApproveStore.filters)

    queryApprovaledList({
      token: userInfoStore.token,
      version: userInfoStore.version,
      timestamp: JSON.stringify(new Date().getTime()),
      param: {
        param,
        pageSize: pagination.pageSize,
        pageIndex: pagination.current - 1
      }
    })
      .then(({ data }) => {
        const { rows, pageIndex, pageSize, total } = data
        setData(dataformat(rows))
        setPagination({ current: pageIndex + 1, pageSize, total })
      })
      .finally(() => setIsTableLoading(false))
  }

  const dataformat = dataFormRESTful => {
    return dataFormRESTful.map(it => ({
      id: it.orgCode,
      phone: it.phone,
      name: it.contact,
      teamName: it.orgName,
      teamType: it.orgType,
      status: !it.enabled ? '禁用' : '启用',
      isDisable: !it.enabled
    }))
  }

  const submit = isDisable => {
    Modal.confirm({
      title: `确认${!isDisable ? '启用' : '禁用'}？`,
      icon: <ExclamationCircleOutlined />,
      content: `是否确认${!isDisable ? '启用' : '禁用'}所选团队`,
      onOk() {
        updateEnabled({
          token: userInfoStore.token,
          version: userInfoStore.version,
          timestamp: JSON.stringify(new Date().getTime()),
          param: {
            enabled: !isDisable,
            orgCodes: orgCodes
          }
        }).then(res => {
          message.success('操作成功')
          fetch()
        })
      }
    })
  }

  const doEnable = () => {
    orgCodes = selectedKeys
    submit(false)
  }

  const doDisable = () => {
    orgCodes = selectedKeys
    submit(true)
  }

  const handleTableChange = pagination => {
    setPagination(pagination)
  }

  const handleClick = item => {
    console.log('编辑', item)
    history.push(`/organization/approve/edit/${item.id}`)
  }

  const optArea = () => (
    <>
      <Button type="primary" onClick={doEnable} disabled={!selectedKeys.length}>
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
          width: 125,
          render: (value, row, index) => (
            <>
              {row.isDisable ? (
                <a
                  href="js:void()"
                  onClick={() => {
                    orgCodes = [row.id]
                    submit(false)
                  }}
                >
                  启用
                </a>
              ) : (
                <a
                  href="js:void()"
                  onClick={() => {
                    orgCodes = [row.id]
                    submit(true)
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
                  <Menu.Item key="edit" onClick={() => handleClick(row)}>
                    编辑
                  </Menu.Item>
                  <Menu.Item key="detail" disabled>
                    详情
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
