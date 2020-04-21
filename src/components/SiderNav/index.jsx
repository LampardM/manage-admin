/*
 * @Description: 单页面导航
 * @Author: jieq
 * @Date: 2020-04-16 02:49:09
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-21 22:16:12
 */
import React from 'react'
import Menu from '../Menu/index'
import styled from 'styled-components'

/** Mock */
import navMenus from '@/router.map'

class SiderNav extends React.Component {
  render() {
    const { className } = this.props.className
    return (
      <div className={className}>
        <div className="nav-container">
          <div style={styles.logo}></div>
          <Menu menus={navMenus} />
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
