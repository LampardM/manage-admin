/**
 * @Desc 表格
 * @exports class
 * @Author jieq
 * @Date 2020-04-18 10:41:52
 * @LastEditors jieq
 * @LastEditTime 2020-04-25 00:09:06
 */
/** official */
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import React, { useState, useEffect } from 'react'

/** vendor */
import { Row, Col, Button, Table, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

/** custom */
import { useStore } from '@/hooks/useStore'

//表头
const columns = [
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
    title: '审核时间',
    dataIndex: 'datetime',
    ellipsis: true,
    textWrap: 'word-break'
  },
  {
    title: '审核人',
    dataIndex: 'handler',
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
            teamName: 'team-name-1',
            teamType: 'team-type-1',
            name: 'name-1',
            phone: 'phone-1',
            handler: 'enable'
          },
          {
            id: 2,
            teamName: 'team-name-2',
            teamType: 'team-type-2',
            name: 'name-2',
            phone: 'phone-2',
            handler: 'disable'
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

  const doDelete = item => {
    Modal.confirm({
      title: '确认删除?',
      icon: <ExclamationCircleOutlined />,
      content: '是否确认删除所选成员',
      onOk() {
        console.log('删除', selectedKeys, item)
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  const handleTableChange = () => {}

  const optArea = () => (
    <>
      <Button type="primary" onClick={doDelete}>
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
          width: 70,
          render: (value, row, index) => (
            <>
              <a href="js:void()" onClick={() => doDelete(row)}>
                删除
              </a>
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
