/*
 * @Description: 单页面导航
 * @Author: jieq
 * @Date: 2020-04-16 02:49:09
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-07-14 00:33:10
 */
import React from 'react'
import Menu from '../Menu/index'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import styled from 'styled-components'
import SideDepartmentList from './SideDepartmentList'

/** Mock */
import navMenus from '@/router.map'
@withRouter
@observer
@inject('userInfoStore')
class SiderNav extends React.Component {
  render() {
    const { className, userInfoStore } = this.props
    let curDepartmentList =
      typeof toJS(userInfoStore.organizes) === 'string'
        ? JSON.parse(toJS(userInfoStore.organizes))
        : toJS(userInfoStore.organizes)
    console.log(curDepartmentList, 'userInfoStore.organizes')
    return (
      <div className={className}>
        <div className="nav-container">
          <SideDepartmentList />
          <Menu
            menus={
              curDepartmentList.length > 0 ? navMenus : [navMenus[0], navMenus[navMenus.length - 2]]
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
