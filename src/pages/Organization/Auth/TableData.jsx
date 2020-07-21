/**
 * @Desc 表格
 * @exports class
 * @Author jieq
 * @Date 2020-04-18 10:41:52
 * @LastEditors jieq
 * @LastEditTime 2020-05-09 02:30:13
 */
/** official */
import { toJS } from 'mobx'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import { useHistory } from 'react-router-dom'
import React, { useState, useEffect } from 'react'

/** vendor */
import { Button, Table } from 'antd'

/** custom */
import { Ext } from '@/utils'
import { queryAuthorizeList } from '@/api'
import { useStore } from '@/hooks/useStore'

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
    dataIndex: 'dateTime',
    ellipsis: true,
    textWrap: 'word-break'
  },
  {
    title: '审核人',
    width: 100,
    dataIndex: 'actionPerson',
    ellipsis: true,
    textWrap: 'word-break'
  }
]

const TableData = observer(({ className }) => {
  const history = useHistory()
  const { userInfoStore, OrganizationAuthStore } = useStore()

  const [data, setData] = useState([])
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [pagination, setPagination] = useState({ current: 1, pageSize: PAGE_SIZE })

  useEffect(() => {
    fetch()
  }, [pagination.current, pagination.pageSize])

  useEffect(() => {
    setPagination({ current: 1, pageSize: PAGE_SIZE })
  }, [OrganizationAuthStore.filters])

  const fetch = async () => {
    setIsTableLoading(true)

    const param = toJS(OrganizationAuthStore.filters)

    if (!Ext.isHasValue(param.orgTypeCode)) {
      param.orgTypeCode = ''
    }

    queryAuthorizeList({
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
      phone: it.phone,
      name: it.contact,
      teamName: it.orgName,
      teamType: it.orgType,
      dateTime: it.submitTime,
      actionPerson: it.submitterName
    }))
  }

  const doAuthorization = item => {
    console.log('授权', item)

    history.push(`/organization/auth/info/${item.id}`)
  }

  const handleTableChange = pagination => {
    setPagination(pagination)
  }

  return (
    <div className={className}>
      <Table
        style={{ marginTop: 24 }}
        columns={columns.concat({
          title: '操作',
          dataIndex: 'action',
          width: 65,
          render: (_, item) => {
            return (
              <Button type="link" className="action-item" onClick={() => doAuthorization(item)}>
                授权
              </Button>
            )
          }
        })}
        rowKey={(row, idx, self) => {
          return row.id
        }}
        dataSource={data}
        pagination={pagination}
        loading={isTableLoading}
        onChange={handleTableChange}
      />
    </div>
  )
})

export default styled(TableData)`
  .action-item {
    padding: 0 !important;
  }
`
