/**
 * @Desc In User Settings Edit
 * @exports class
 * @Author jieq
 * @Date 2020-04-18 10:41:52
 * @LastEditors jieq
 * @LastEditTime 2020-04-18 23:55:09
 */
/** official */
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import React, { useState, useEffect } from 'react'

/** vendor */
import { Row, Col, Button, Table } from 'antd'

/** custom */
import { Ext } from '../../../utils'
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
    title: '申请时间',
    dataIndex: 'dateTime',
    ellipsis: true,
    textWrap: 'word-break'
  }
]

const TableData = ({ filters }) => {
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({})
  const [selectedKeys, setSelectedKeys] = useState([])
  const [isTableLoading, setIsTableLoading] = useState(true)
  const { OrganizationCheckStore } = useStore()

  useEffect(() => {
    fetch(toJS(OrganizationCheckStore.filters))
  }, [OrganizationCheckStore.filters])

  const fetch = async (params = {}) => {
    console.log('fetch', params)
    // request({
    //   url: 'https://randomuser.me/api',
    //   method: 'get',
    //   data: {
    //     results: 10,
    //     ...params
    //   },
    //   type: 'json'
    // }).then(data => {
    //   setData(dataformat(data.results))
    //   setPagination(data.pages)
    setIsTableLoading(false)
    // })
  }

  const dataformat = dataFormRESTful => {
    return dataFormRESTful.map(it => ({
      ...it
    }))
  }

  const approve = () => {
    console.log('通过', selectedKeys)
  }

  const reject = () => {
    console.log('驳回', selectedKeys)
  }

  const handleTableChange = () => {}

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
        rowKey={(row, idx, self) => {
          return row.uuid
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
