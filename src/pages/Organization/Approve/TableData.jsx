/**
 * @Desc In User Settings Edit
 * @exports class
 * @Author jieq
 * @Date 2020-04-18 10:41:52
 * @LastEditors jieq
 * @LastEditTime 2020-04-21 00:51:43
 */
/** official */
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import React, { useState, useEffect } from 'react'

/** vendor */
import { DownOutlined } from '@ant-design/icons'
import { Row, Col, Button, Table, Menu } from 'antd'

/** custom */
import { Ext } from '../../../utils'
import { useStore } from '@/hooks/useStore'

//表头
const columns = [
  {
    title: '团队编号',
    dataIndex: 'teamNo',
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
    dataIndex: 'teamType',
    ellipsis: true,
    textWrap: 'word-break'
  },
  {
    title: '联系人',
    dataIndex: 'name',
    ellipsis: true,
    textWrap: 'word-break'
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    ellipsis: true,
    textWrap: 'word-break'
  },
  {
    title: '状态',
    dataIndex: 'status',
    ellipsis: true,
    textWrap: 'word-break'
  }
]

const TableData = ({ className, filters }) => {
  const history = useHistory()
  const [data, setData] = useState([])
  const { OrganizationApproveStore } = useStore()
  const [pagination, setPagination] = useState({})
  const [selectedKeys, setSelectedKeys] = useState([])
  const [isTableLoading, setIsTableLoading] = useState(true)

  useEffect(() => {
    fetch(toJS(OrganizationApproveStore.filters))
  }, [OrganizationApproveStore.filters])

  const fetch = async (params = {}) => {
    console.log('fetch', params)
    setTimeout(() => {
      const data = {
        pages: {},
        results: [
          {
            id: 1,
            teamNo: 'team-no-1',
            teamName: 'team-name-1',
            teamType: 'team-type-1',
            name: 'name-1',
            phone: 'phone-1',
            status: 'enable'
          },
          {
            id: 2,
            teamNo: 'team-no-2',
            teamName: 'team-name-2',
            teamType: 'team-type-2',
            name: 'name-2',
            phone: 'phone-2',
            status: 'disable'
          }
        ]
      }
      setData(dataformat(data.results))
      setPagination(data.pages)
      setIsTableLoading(false)
    }, 1000)
  }

  const dataformat = dataFormRESTful => {
    return dataFormRESTful.map(it => ({
      ...it,
      isDisable: !!(it.status === 'disable')
    }))
  }

  const doEnable = item => {
    console.log('启用', selectedKeys, item)
  }

  const doDisable = item => {
    console.log('禁用', selectedKeys, item)
  }

  const handleTableChange = () => {}

  const handleClick = item => {
    console.log('编辑', item)
    history.push(`/organization/approve/edit?id=${item.id}`)
  }

  const optArea = () => (
    <>
      <Button type="primary" onClick={doEnable}>
        启用
      </Button>
      <Button
        style={{
          margin: '0 4px'
        }}
        onClick={doDisable}
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
}

export default observer(styled(TableData)`
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
`)
