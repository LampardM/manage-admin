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
    setTimeout(() => {
      const data = {
        results: [
          {
            id: 1,
            teamName: '示例',
            phone: '13111335599'
          }
        ],
        pages: {}
      }
      setData(dataformat(data.results))
      setPagination(data.pages)
      setIsTableLoading(false)
    }, 1000)
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
          return row.id
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
