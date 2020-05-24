/*
 * @Description: nav团队列表
 * @Author: longzhang6
 * @Date: 2020-05-13 22:13:14
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-05-24 17:56:00
 */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Menu } from 'antd'
import { useSessionStorage } from 'react-use'

const SideDepartmentList = () => {
  const [userOrganizes] = useSessionStorage('user-organizes')

  return (
    <Menu
      mode="inline"
      theme="dark"
      defaultSelectedKeys={userOrganizes.map(org => {
        if (org.selected) return org.code
      })}
    >
      {userOrganizes.map((organization, idx) => (
        <Menu.Item key={idx}>{organization.name}</Menu.Item>
      ))}
    </Menu>
  )
}

export default SideDepartmentList
