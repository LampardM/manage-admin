/*
 * @Description: nav团队列表
 * @Author: longzhang6
 * @Date: 2020-05-13 22:13:14
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-07-01 00:02:33
 */
import React, { useState, useEffect } from 'react'
import { Menu, Dropdown } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { useSessionStorage } from 'react-use'
import { useStore } from '@/hooks/useStore'
import { switchDepartment } from '@/api/department'
import { useHistory } from 'react-router-dom'
import { setCurDepart, getCurDepart } from '@/utils/session'
import styled from 'styled-components'

const SideDepartmentList = () => {
  const [userOrganizes] = useSessionStorage('user-organizes')
  const { userInfoStore } = useStore()
  const [selectedKeys, setSelectedKeys] = useState([])
  const history = useHistory()

  useEffect(() => {
    setSelectedKeys([getCurDepart()])
  }, [])

  const selectHandler = item => {
    let _params = {
      param: item.key,
      timestamp: JSON.stringify(new Date().getTime()),
      token: userInfoStore.token,
      version: userInfoStore.version
    }
    switchDepartment(_params)
      .then(_result => {
        setCurDepart([item.key])
        setSelectedKeys([item.key])
        history.push('/home')
      })
      .catch(err => {
        console.log(err)
      })
  }

  const getCurDepartName = () => {
    let _result = userOrganizes.find(depart => depart.code === getCurDepart())
    return _result.name
  }

  const menu = (
    <Menu
      theme="dark"
      onClick={selectHandler}
      selectedKeys={selectedKeys}
      defaultSelectedKeys={
        userOrganizes && userOrganizes.length
          ? userOrganizes.map(org => {
              if (org.selected) return org.code
            })
          : []
      }
    >
      {userOrganizes &&
        userOrganizes.length &&
        userOrganizes.map((organization, idx) => (
          <Menu.Item
            key={organization.code}
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              paddingLeft: '16px',
              paddingBottom: '12px',
              backgroundColor: '#001529',
              width: '200px',
              maxWidth: '200px',
              minWidth: '200px',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis'
            }}
          >
            {organization.name}
          </Menu.Item>
        ))}
    </Menu>
  )

  return (
    <Dropdown overlay={menu} trigger={['hover']} onClick={e => e.preventDefault()}>
      <DepartmentCur>
        <Curpart>{getCurDepartName()}</Curpart>
        <DownOutlined />
      </DepartmentCur>
    </Dropdown>
  )
}

const DepartmentCur = styled.div`
  height: 32px;
  padding: 16px;
  margin: 16px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
`

const Curpart = styled.div`
  width: 150px;
  max-width: 150px;
  min-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export default SideDepartmentList
