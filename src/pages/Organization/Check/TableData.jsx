/**
 * @Desc 表格
 * @exports class
 * @Author jieq
 * @Date 2020-04-18 10:41:52
 * @LastEditors jieq
 * @LastEditTime 2020-04-27 21:13:47
 */
/** official */
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import React, { useState, useEffect } from 'react'

/** vendor */
import { Row, Col, Button, Table } from 'antd'

/** custom */
import { Ext } from '../../../utils'
import { useStore } from '@/hooks/useStore'
import { approving } from '@/api'

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
    title: '申请时间',
    dataIndex: 'dateTime',
    ellipsis: true,
    textWrap: 'word-break'
  }
]

const TableData = ({ filters }) => {
  const { OrganizationCheckStore } = useStore()
  const { userInfoStore } = useStore('userInfoStore')

  const [data, setData] = useState([])
  const [selectedKeys, setSelectedKeys] = useState([])
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [pagination, setPagination] = useState({ current: 1, pageSize: PAGE_SIZE })

  useEffect(() => {
    const param = toJS(OrganizationCheckStore.filters)

    if (!Ext.isHasValue(param.orgTypeCode)) {
      param.orgTypeCode = ''
    }

    fetch(param)
  }, [pagination.current, pagination.pageSize, OrganizationCheckStore.filters])

  const fetch = (param = {}) => {
    setIsTableLoading(true)
    console.log('fetch', param)

    approving({
      timestamp: JSON.stringify(new Date().getTime()),
      token: userInfoStore.token,
      version: userInfoStore.version,
      param: {
        param,
        pageIndex: pagination.current,
        pageSize: pagination.pageSize
      }
    })
      .then(({ data }) => {
        const { rows, pageIndex, pageSize, total } = data
        setData(dataformat(rows))
        setPagination({ current: pageIndex, pageSize, total })
      })
      .finally(() => {
        setIsTableLoading(false)
      })
  }

  const dataformat = dataFormRESTful => {
    return dataFormRESTful.map(it => ({
      phone: it.phone,
      name: it.contact,
      teamName: it.orgName,
      teamType: it.orgType,
      dateTime: it.submitTime
    }))
  }

  const approve = () => {
    console.log('通过', selectedKeys)
  }

  const reject = () => {
    console.log('驳回', selectedKeys)
  }

  const onChange = (pagination /*{current, pageSize}*/) => {
    setPagination(pagination)
  }

  const optArea = () => (
    <>
      <Button type="primary" onClick={approve}>
        通过
      </Button>
      <Button
        style={{
          margin: '0 4px'
        }}
        onClick={reject}
      >
        驳回
      </Button>
    </>
  )

  return (
    <>
      <Row>
        <Col>{optArea()}</Col>
      </Row>

      <Table
        style={{ marginTop: 24 }}
        columns={columns.concat({
          title: '操作',
          dataIndex: 'action',
          width: 100,
          render: () => (
            <>
              <a
                style={{
                  marginRight: 10
                }}
                href="js:void()"
                onClick={approve}
              >
                通过
              </a>
              <a href="js:void()" onClick={reject}>
                驳回
              </a>
            </>
          )
        })}
        rowKey={(row, idx /*, self*/) => {
          return idx
        }}
        dataSource={data}
        onChange={onChange}
        pagination={pagination}
        loading={isTableLoading}
        rowSelection={{
          onChange: (selectedKeys, selectedItems) => {
            console.log(`selectedRowKeys: ${selectedKeys}`, 'selectedRows: ', selectedItems)
            setSelectedKeys(selectedKeys)
          }
          // getCheckboxProps: record => ({
          //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
          //   name: record.name
          // })
        }}
      />
    </>
  )
}
// class TableData extends React.Component {
//   componentDidMount() {
//     this.props.fetch()
//   }

//   render() {
//     return <Table />
//   }
// }
export default observer(TableData)
