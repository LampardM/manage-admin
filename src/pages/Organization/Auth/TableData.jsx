/**
 * @Desc In User Settings Edit
 * @exports class
 * @Author jieq
 * @Date 2020-04-18 10:41:52
 * @LastEditors jieq
 * @LastEditTime 2020-04-21 00:55:59
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
import request from '@/utils/request'
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
    dataIndex: 'dateTime',
    ellipsis: true,
    textWrap: 'word-break'
  },
  {
    title: '审核人',
    dataIndex: 'actionPerson',
    ellipsis: true,
    textWrap: 'word-break'
  }
]

const TableData = ({ className, filters, go }) => {
  const history = useHistory()
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({})
  const [isTableLoading, setIsTableLoading] = useState(true)
  const { OrganizationAuthStore } = useStore()

  useEffect(() => {
    fetch(toJS(OrganizationAuthStore.filters))
  }, [OrganizationAuthStore.filters])

  const fetch = async (params = {}) => {
    console.log('fetch', params)
    request({
      url: 'https://randomuser.me/api',
      method: 'get',
      data: {
        results: 10,
        ...params
      },
      type: 'json'
    }).then(data => {
      setData(dataformat(data.results))
      setPagination(data.pages)
      setIsTableLoading(false)
    })
  }

  const dataformat = dataFormRESTful => {
    return dataFormRESTful.map(it => ({
      ...it
    }))
  }

  const doAuthorization = item => {
    console.log('授权', item)

    history.push(`/organization/auth/info?id=${3}`)
  }

  const handleTableChange = () => {}

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
              <Button type="link" className="action-item" onClick={doAuthorization}>
                授权
              </Button>
            )
          }
        })}
        rowKey={(row, idx, self) => {
          return row.cell
        }}
        dataSource={data}
        pagination={pagination}
        loading={isTableLoading}
        onChange={handleTableChange}
      />
    </div>
  )
}

export default observer(styled(TableData)`
  .action-item {
    padding: 0 !important;
  }
`)
