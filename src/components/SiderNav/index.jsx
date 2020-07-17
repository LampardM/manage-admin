/*
 * @Description: 单页面导航
 * @Author: jieq
 * @Date: 2020-04-16 02:49:09
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-07-17 23:24:39
 */
import React from 'react'
import Menu from '../Menu/index'
import { withRouter } from 'react-router-dom'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { navMap } from '@/router.map'
import SideDepartmentList from './SideDepartmentList'

/** Mock */
import navMenus from '@/router.map'
@withRouter
@observer
class SiderNav extends React.Component {
  state = {
    menuslist: [],
    whitelist: ['/create', '/home', '/setting']
  }
  componentDidMount() {
    this.computedCurUserMenus()
  }

  computedCurUserMenus() {
    let userComeMenus = JSON.parse(localStorage.getItem('user-menus'))
    console.log(userComeMenus, 'menus')
    if (userComeMenus && userComeMenus.length !== 0) {
      this.handleInitMenus(userComeMenus, navMenus)
    }
    this.setState({ menuslist: navMenus })
  }

  handleInitMenus(userMenus, configMenus) {
    configMenus.forEach(_target => {
      let menu = userMenus.find(_nav => {
        return _target.key === navMap[_nav.key]
      })
      if (menu) {
        _target.show = true
        if (menu.subs && menu.subs.length > 0) {
          this.handleInitMenus(menu.subs, _target.subs)
        }
      } else {
        _target.show = this.state.whitelist.includes(_target.key) ? true : false
      }
    })
  }

  render() {
    const { className } = this.props
    const { menuslist } = this.state

    return (
      <div className={className}>
        <div className="nav-container">
          <SideDepartmentList changeDepartment={this.computedCurUserMenus.bind(this)} />
          <Menu menus={menuslist} />
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
