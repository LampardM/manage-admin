/*
 * @Description: 单页面导航
 * @Author: jieq
 * @Date: 2020-04-16 02:49:09
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-07-17 20:16:08
 */
import React from 'react'
import Menu from '../Menu/index'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import SideDepartmentList from './SideDepartmentList'

/** Mock */
import navMenus from '@/router.map'
@withRouter
@observer
class SiderNav extends React.Component {
  componentDidMount() {
    // this.computedCurUserMenus()
  }

  computedCurUserMenus() {
    let initUserMenus = JSON.parse(localStorage.getItem('user-menus'))
    console.log(initUserMenus, 'menus')
    if (initUserMenus.length === 0) {
      return navMenus
    } else {
      this.handleInitMenus(initUserMenus, navMenus)
    }
  }

  handleInitMenus(menus, origin) {
    menus.forEach(menu => {
      let _target = origin.find(_nav => {
        return _nav.key === menu.key
      })

      if (_target) {
        _target.show = true
        if (menu.subs && menu.subs.length > 0) {
          this.handleInitMenus(menu.subs, _target.subs)
        }
      }
    })
  }

  render() {
    const { className } = this.props
    let initDepartmentList = JSON.parse(localStorage.getItem('user-organizes'))

    return (
      <div className={className}>
        <div className="nav-container">
          <SideDepartmentList />
          <Menu
            menus={
              initDepartmentList.length > 0
                ? navMenus
                : [navMenus[0], navMenus[navMenus.length - 2]]
            }
          />
        </div>
      </div>
    )
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
