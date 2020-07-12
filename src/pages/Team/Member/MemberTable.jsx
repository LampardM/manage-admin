/*
 * @Description: 成员管理table
 * @Author: longzhang6
 * @Date: 2020-04-19 19:11:00
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-07-12 14:50:17
 */
import { observer } from 'mobx-react'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Table, Dropdown, Menu, Space, Button, Row, Col } from 'antd'
import { useStore } from '@/hooks/useStore'
import { DownOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import { invitationRecord, invitedRecord } from '@/api/member'

//表头
const columns = [
  {
    title: '姓名',
    dataIndex: 'memberName',
    ellipsis: true,
    width: 150,
    textWrap: 'word-break'
  },
  {
    title: '手机号码',
    dataIndex: 'contextPhone',
    ellipsis: true,
    width: 150,
    textWrap: 'word-break'
  },
  {
    title: '角色',
    dataIndex: 'roleName',
    ellipsis: true,
    width: 200,
    textWrap: 'word-break'
  },
  {
    title: '所属部门',
    dataIndex: 'departmentName',
    ellipsis: true,
    textWrap: 'word-break'
  }
]

const PAGE_SIZE = 10

const joinMenuHandler = (record, item, key) => {}

const MemberTable = props => {
  const { curselect } = props
  const { userInfoStore, MemberStore } = useStore()
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: PAGE_SIZE })
  const [isTableLoading, setIsTableLoading] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState([])
  const history = useHistory()

  const handleTableChange = () => {}

  const addMember = () => {
    history.push('/team/member/addmember')
  }

  useEffect(() => {
    fetch()
  }, [curselect])

  useEffect(() => {
    fetch()
  }, [pagination.current, pagination.pageSize, MemberStore.filters])

  const fetch = () => {
    setIsTableLoading(true)
    let _params = {
      timestamp: JSON.stringify(new Date().getTime()),
      token: userInfoStore.token,
      version: userInfoStore.version
    }
    if (curselect === 'invited') {
      invitationRecord(_params)
        .then(_result => {
          console.log(_result)
          let _lastResult = _result.data.map(invite => {
            return Object.assign({}, { key: invite.invitationCode }, invite)
          })
          // const { pageIndex, pageSize, total } = data
          // setPagination({ current: pageIndex + 1, pageSize, total })
          setIsTableLoading(false)
          setData(_lastResult)
        })
        .catch(err => console.log(err))
    } else {
      let _invitedParams = {
        param: {
          pageIndex: 0,
          pageSize: 10,
          param: {
            memberName: '',
            phone: ''
          }
        },
        timestamp: '',
        token: '',
        version: ''
      }
      // invitedRecord(_invitedParams)
      setIsTableLoading(false)
      setData([
        {
          key: '1',
          memberName: '胡彦斌',
          contextPhone: 18356032765,
          roleName: 32,
          departmentName: '西湖区湖底公园1号'
        },
        {
          key: '2',
          memberName: '胡彦祖',
          contextPhone: 18356032765,
          roleName: 32,
          departmentName: '西湖区湖底公园1号'
        }
      ])
    }
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
      <Menu onClick={(item, key) => joinMenuHandler(record, item, key)}>
        <Menu.Item key="1">复制链接</Menu.Item>
        <Menu.Item key="2">取消邀请</Menu.Item>
      </Menu>
    )
  }

  const joinedAction = record => {
    return (
      <Space>
        <span style={{ color: '#1890ff' }}>编辑</span>
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
        <span style={{ color: '#1890ff' }}>再邀请</span>
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

export default MemberTable
