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
import { Row, Col, Button, Table, Modal, message, Input } from 'antd'

/** custom */
import { Ext } from '@/utils'
import { useStore } from '@/hooks/useStore'
import { getApproval, queryApprovingList } from '@/api'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const PAGE_SIZE = 10

const { TextArea } = Input

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

let orgCodes = []

const TableData = () => {
  const { userInfoStore, OrganizationCheckStore } = useStore()
  const [data, setData] = useState([])
  const [selectedKeys, setSelectedKeys] = useState([])
  const [rejectReason, setRejectReason] = useState('')
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [isVisibleRejectModal, setIsVisibleRejectModal] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: PAGE_SIZE })

  useEffect(() => {
    fetch()
  }, [OrganizationCheckStore.filters])

  const fetch = (pageIndex = 0, pageSize = PAGE_SIZE) => {
    setIsTableLoading(true)

    const param = toJS(OrganizationCheckStore.filters)

    if (!Ext.isHasValue(param.orgTypeCode)) {
      param.orgTypeCode = ''
    }

    queryApprovingList({
      token: userInfoStore.token,
      version: userInfoStore.version,
      timestamp: JSON.stringify(new Date().getTime()),
      param: {
        param,
        pageIndex: pageIndex,
        pageSize: pageSize
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
      dateTime: it.submitTime
    }))
  }

  const submit = isReject => {
    Modal.confirm({
      title: `确认${!isReject ? '通过' : '驳回'}？`,
      icon: <ExclamationCircleOutlined />,
      content: `是否确认${!isReject ? '通过' : '驳回'}所选团队创建申请`,
      onOk() {
        console.log('OK')
        if (isReject) {
          setIsVisibleRejectModal(true)
        } else {
          doApproval(isReject)
        }
      }
    })
  }

  const doApproval = (isReject = false) => {
    console.log(orgCodes)

    if (orgCodes.length) {
      getApproval({
        token: userInfoStore.token,
        version: userInfoStore.version,
        timestamp: JSON.stringify(new Date().getTime()),
        param: {
          orgCodes,
          reject: isReject,
          memo: rejectReason //驳回时添加的说明
        }
      })
        .then(() => {
          message.success('审批成功！')
          setRejectReason('')
          fetch()
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  const approve = () => {
    orgCodes = selectedKeys
    submit(false)
  }

  const reject = () => {
    orgCodes = selectedKeys
    submit(true)
  }

  const onChange = pagination => {
    fetch(pagination.current - 1, pagination.pageSize)
    setPagination(pagination)
  }

  const optArea = () => (
    <>
      <Button type="primary" onClick={approve} disabled={!selectedKeys.length}>
        通过
      </Button>
      <Button
        style={{
          margin: '0 4px'
        }}
        onClick={reject}
        disabled={!selectedKeys.length}
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
          render: (text, item) => (
            <>
              <a
                style={{
                  marginRight: 10
                }}
                href="js:void()"
                onClick={() => {
                  orgCodes = [item.id]
                  submit(false)
                }}
              >
                通过
              </a>
              <a
                href="js:void()"
                onClick={() => {
                  orgCodes = [item.id]
                  submit(true)
                }}
              >
                驳回
              </a>
            </>
          )
        })}
        rowKey={(row, idx /*, self*/) => {
          return row.id
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

      <Modal
        title="驳回"
        visible={isVisibleRejectModal}
        onOk={() => {
          setIsVisibleRejectModal(false)
          doApproval(true)
        }}
        onCancel={() => {
          console.log(orgCodes)
          setIsVisibleRejectModal(false)
        }}
      >
        <Row>
          <Col>驳回原因：</Col>
          <Col style={{ width: '75%' }}>
            <TextArea
              placeholder="请输入驳回原因"
              value={rejectReason}
              autoSize={{ minRows: 4, maxRows: 6 }}
              onChange={({ currentTarget }) => {
                setRejectReason(currentTarget.value)
              }}
            />
          </Col>
        </Row>
      </Modal>
    </>
  )
}
export default observer(TableData)
