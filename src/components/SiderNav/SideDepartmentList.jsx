/*
 * @Description: nav团队列表
 * @Author: longzhang6
 * @Date: 2020-05-13 22:13:14
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-06-11 22:11:08
 */
import React, { useState, useEffect } from 'react'
import { Menu } from 'antd'
import { useSessionStorage } from 'react-use'
import { useStore } from '@/hooks/useStore'
import { switchDepartment } from '@/api/department'
import { setCurDepart, getCurDepart } from '@/utils/session'

const SideDepartmentList = () => {
  const [userOrganizes] = useSessionStorage('user-organizes')
  const { userInfoStore } = useStore()
  const [selectedKeys, setSelectedKeys] = useState([])

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
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <Menu
      mode="inline"
      theme="dark"
      onSelect={selectHandler}
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
          <Menu.Item key={organization.code} style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {organization.name}
          </Menu.Item>
        ))}
    </Menu>
  )
}

export default SideDepartmentList
