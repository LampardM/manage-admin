/*
 * @Description: 单页面导航
 * @Author: jieq
 * @Date: 2020-04-16 02:49:09
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-05-24 17:51:38
 */
import React from 'react'
import Menu from '../Menu/index'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import SideDepartmentList from './SideDepartmentList'
import { useSessionStorage } from 'react-use'

/** Mock */
import navMenus from '@/router.map'
@withRouter
@observer
@inject('userInfoStore')
class SiderNav extends React.Component {
  render() {
    const { className, userInfoStore } = this.props

    return (
      <div className={className}>
        <div className="nav-container">
          <div style={styles.logo}></div>
          <SideDepartmentList />
          <Menu
            menus={
              userInfoStore.organizes.length > 0
                ? navMenus
                : [navMenus[0], navMenus[navMenus.length - 2]]
            }
          />
        </div>
      </div>
    )
  }
}

const styles = {
  logo: {
    height: '32px',
    background: 'rgba(255, 255, 255, .2)',
    margin: '16px'
  }
}

export default styled(SiderNav)`
  .nav-container {
    height: 100vh;
    overflow-y: auto;
  }

  .nav-container::-webkit-scrollbar {
    width: 0;
  }
`
