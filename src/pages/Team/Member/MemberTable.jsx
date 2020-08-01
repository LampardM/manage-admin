/*
 * @Description: 成员管理table
 * @Author: longzhang6
 * @Date: 2020-04-19 19:11:00
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-07-23 22:04:01
 */
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Table, Dropdown, Menu, Space, Button, Row, Col, Message } from 'antd'
import { useStore } from '@/hooks/useStore'
import { DownOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import { invitationRecord, invitedRecord, resetInviteOrgMember } from '@/api/member'

/** vendor */
import { CopyToClipboard } from 'react-copy-to-clipboard'

/** custom */
import { urlPrefix } from '@/constants'

//表头
const columns = [
  {
    title: '姓名',
    dataIndex: 'memberName',
    ellipsis: true,
    textWrap: 'word-break'
  },
  {
    title: '手机号码',
    dataIndex: 'contextPhone',
    ellipsis: true,
    textWrap: 'word-break'
  }
  // {
  //   title: '角色',
  //   dataIndex: 'roleName',
  //   ellipsis: true,
  //   width: 200,
  //   textWrap: 'word-break'
  // },
  // {
  //   title: '所属部门',
  //   dataIndex: 'departmentName',
  //   ellipsis: true,
  //   textWrap: 'word-break'
  // }
]

const PAGE_SIZE = 10

const MemberTable = props => {
  const { curselect } = props
  const { userInfoStore, MemberStore } = useStore()
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: PAGE_SIZE })
  const [isTableLoading, setIsTableLoading] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState([])
  const history = useHistory()

  const joinMenuHandler = (record, item, key) => {}

  const addMember = () => {
    history.push('/team/member/addmember')
  }

  const editCurMember = member => {
    history.push(`/team/member/editmember/${member.memberCode}`)
  }

  useEffect(() => {
    fetch()
  }, [MemberStore.filters, curselect])

  const fetch = (pageIndex = 0, pageSize = PAGE_SIZE) => {
    setIsTableLoading(true)
    let _params = {
      param: {
        pageIndex: pageIndex,
        pageSize: pageSize,
        param: {
          memberName: toJS(MemberStore.filters).contact,
          memberPhone: toJS(MemberStore.filters).phone
        }
      },
      timestamp: JSON.stringify(new Date().getTime()),
      token: userInfoStore.token,
      version: userInfoStore.version
    }
    if (curselect === 'invited') {
      invitationRecord(_params)
        .then(_result => {
          console.log(_result)
          let _lastResult = _result.data.rows.map(invite => {
            return Object.assign({}, { key: invite.invitationCode }, invite)
          })

          const { pageIndex, pageSize, total } = _result.data
          setPagination({ current: pageIndex + 1, pageSize, total })
          setIsTableLoading(false)
          setData(_lastResult)
        })
        .catch(err => console.log(err))
    } else {
      let _invitedParams = {
        param: {
          pageIndex: pageIndex,
          pageSize: pageSize,
          param: {
            memberName: toJS(MemberStore.filters).contact,
            phone: toJS(MemberStore.filters).phone
          }
        },
        timestamp: JSON.stringify(new Date().getTime()),
        token: userInfoStore.token,
        version: userInfoStore.version
      }
      invitedRecord(_invitedParams)
        .then(_result => {
          setIsTableLoading(false)
          let { rows, pageIndex, pageSize, total } = _result.data
          rows = rows.map(row => {
            let temp = Object.assign({}, row, {
              key: row.memberCode,
              memberName: row.name,
              contextPhone: row.phone
            })
            return temp
          })
          setData(rows)
          setPagination({ current: pageIndex + 1, pageSize, total })
        })
        .catch(err => console.log(err))
    }
  }

  const handleTableChange = pagination => {
    fetch(pagination.current - 1, pagination.pageSize)
    setPagination(pagination)
  }

  const inviteMemberAgain = invitationCode => {
    let _params = {
      param: invitationCode,
      timestamp: JSON.stringify(new Date().getTime()),
      token: userInfoStore.token,
      version: userInfoStore.version
    }
    resetInviteOrgMember(_params)
      .then(_result => {
        Message.success('再此邀请成功！')
      })
      .catch(err => console.log(err))
  }

  const joinedMenu = record => {
    return (
      <Menu onClick={(item, key) => joinMenuHandler(record, item, key)}>
        <Menu.Item key="1">详情</Menu.Item>
        <Menu.Item key="2">删除</Menu.Item>
      </Menu>
    )
  }

  const invitedMenu = record => {
    return (
      <Menu onClick={(item, key) => {}}>
        <Menu.Item key="1">
          <CopyToClipboard
            text={`${urlPrefix}/joindepart/${record.key}`}
            onCopy={() => Message.success('链接复制成功！')}
          >
            <span>复制链接</span>
          </CopyToClipboard>
        </Menu.Item>
        <Menu.Item key="2">取消邀请</Menu.Item>
      </Menu>
    )
  }

  const joinedAction = record => {
    return (
      <Space>
        {/* <span style={{ color: '#1890ff', pointerEvents: 'none'}} disabled>
          详情
        </span> */}
        <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => editCurMember(record)}>
          编辑
        </span>
        <Dropdown overlay={() => joinedMenu(record)}>
          <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            更多
            <DownOutlined />
          </a>
        </Dropdown>
      </Space>
    )
  }

  const invitedAction = record => {
    return (
      <Space>
        <span
          style={{ color: '#1890ff', cursor: 'pointer' }}
          onClick={() => inviteMemberAgain(record.invitationCode)}
        >
          再发送
        </span>
        <Dropdown overlay={() => invitedMenu(record)}>
          <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            更多
            <DownOutlined />
          </a>
        </Dropdown>
      </Space>
    )
  }

  const ActionButton = () => {
    return (
      <>
        {curselect === 'joined' ? (
          <div className="add-remove">
            <Space>
              <Button type="primary" onClick={addMember}>
                添加成员
              </Button>
              <Button disabled={!selectedKeys.length}>删除</Button>
            </Space>
          </div>
        ) : (
          <div className="add-remove">
            <Space>
              <Button type="primary" disabled={!selectedKeys.length}>
                再发送
              </Button>
              <Button disabled={!selectedKeys.length}>取消邀请</Button>
            </Space>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      <Row>
        <Col>{ActionButton(curselect)}</Col>
      </Row>
      <TableContainer>
        <Table
          style={{ marginTop: 0 }}
          columns={columns.concat({
            title: '操作',
            dataIndex: 'action',
            width: 150,
            render: (_, item) => {
              if (curselect === 'joined') {
                return joinedAction(item)
              } else {
                return invitedAction(item)
              }
            }
          })}
          rowKey={(row, idx, self) => {
            return row.key
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
      </TableContainer>
    </>
  )
}

const TableContainer = styled.div``

export default observer(MemberTable)
