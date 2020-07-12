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
import { Row, Col, Button, Table, Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

/** custom */
import { useStore } from '@/hooks/useStore'
import { queryRejectedList, deleteReject } from '@/api'
import { Ext } from '@/utils'

const PAGE_SIZE = 10

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
    title: '审核时间',
    dataIndex: 'datetime',
    ellipsis: true,
    textWrap: 'word-break'
  },
  {
    title: '审核人',
    width: 100,
    dataIndex: 'handler',
    ellipsis: true,
    textWrap: 'word-break'
  }
]

let orgCodes = []

const TableData = observer(({ className, filters }) => {
  const history = useHistory()
  const { userInfoStore, OrganizationRejectStore } = useStore()

  const [data, setData] = useState([])
  const [selectedKeys, setSelectedKeys] = useState([])
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [pagination, setPagination] = useState({ current: 1, pageSize: PAGE_SIZE })

  useEffect(() => {
    fetch()
  }, [pagination.current, pagination.pageSize, OrganizationRejectStore.filters])

  const fetch = async () => {
    setIsTableLoading(true)

    const param = toJS(OrganizationRejectStore.filters)

    if (!Ext.isHasValue(param.orgTypeCode)) {
      param.orgTypeCode = ''
    }

    queryRejectedList({
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
      .finally(() => {
        setIsTableLoading(false)
      })
  }

  const dataformat = dataFormRESTful => {
    return dataFormRESTful.map(it => ({
      id: it.orgCode,
      name: it.contact,
      phone: it.phone,
      teamName: it.orgName,
      teamType: it.orgType,
      datetime: it.submitTime,
      handler: it.submitterName
    }))
  }

  const doDelete = () => {
    Modal.confirm({
      title: '确认删除?',
      icon: <ExclamationCircleOutlined />,
      content: '是否确认删除所选成员',
      onOk() {
        console.log('删除', orgCodes)
        deleteReject({
          token: userInfoStore.token,
          version: userInfoStore.version,
          timestamp: JSON.stringify(new Date().getTime()),
          param: orgCodes
        }).then(res => {
          if (+res.success === 1) {
            message.success(`删除成功`)
            fetch()
          }
        })
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  const onChange = (pagination /*{current, pageSize}*/) => {
    setPagination(pagination)
  }

  const optArea = () => (
    <>
      <Button
        type="primary"
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
          width: 70,
          render: (value, row, index) => (
            <>
              <a
                href="js:void()"
                onClick={() => {
                  orgCodes = [row.id]
                  doDelete(row)
                }}
              >
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
        onChange={onChange}
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
