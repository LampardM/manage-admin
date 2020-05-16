/**
 * @Desc 基本信息
 * @exports class
 * @Author jieq
 * @Date 2020-04-19 14:50:14
 * @LastEditors jieq
 * @LastEditTime 2020-04-20 22:25:34
 */
/** official */
import { observer } from 'mobx-react'
import React, { useState } from 'react'

/** vendor */
import { Menu } from 'antd'

/** custom */
import { Ext } from '../../../utils'
import { useStore } from '@/hooks/useStore'

/** ui */
import Privilege from './Privilege'

export default observer(() => {
  const [menuSelected, setMenuSelected] = useState('privilege')

  const handleClick = ({ key }) => {
    setMenuSelected(key)
  }

  return (
    <>
      <Menu
        mode="horizontal"
        onClick={handleClick}
        selectedKeys={[menuSelected]}
        defaultSelectedKeys={['privilege']}
      >
        <Menu.Item key="basicInfo" disabled>
          基本信息
        </Menu.Item>
        <Menu.Item key="privilege">功能权限</Menu.Item>
      </Menu>
      {menuSelected === 'basicInfo' ? null : <Privilege />}
    </>
  )
})
