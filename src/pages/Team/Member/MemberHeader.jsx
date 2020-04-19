/*
 * @Description: 成员管理Header
 * @Author: longzhang6
 * @Date: 2020-04-19 18:28:42
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-19 18:40:32
 */
import React, { useState } from 'react'
import styled from 'styled-components'
import { Menu } from 'antd'

const MemberHeader = props => {
  const [memTabs, setMemTabs] = useState([
    { id: 'joined', name: '已加入' },
    { id: 'invited', name: '已邀请' }
  ])
  const [curTab, setCurTab] = useState('joined')

  const handleClick = info => {
    setCurTab(info.key)
    props.switchCurSource(info.key)
  }

  return (
    <MemberHeaderCon>
      <Menu onClick={handleClick} selectedKeys={curTab} mode="horizontal">
        {memTabs.map(tab => (
          <Menu.Item key={tab.id}>{tab.name}</Menu.Item>
        ))}
      </Menu>
    </MemberHeaderCon>
  )
}

const MemberHeaderCon = styled.div`
  padding: 0 15px;
  background: #fff;
`

export default MemberHeader
