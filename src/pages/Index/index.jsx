/*
 * @Description: 登录后首页
 * @Author: longzhang6
 * @Date: 2020-04-11 16:05:16
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-16 22:39:42
 */
import React from 'react'
import { Layout } from 'antd'
import SiderNav from '../../components/SiderNav'
// import ContentMain from '../../components/ContentMain'
import HeaderBar from '../../components/HeaderBar'

class Index extends React.Component {
  state = {
    collapsed: false
  }

  toggle = () => {
    // console.log(this)  状态提升后，到底是谁调用的它
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render() {
    // 设置Sider的minHeight可以使左右自适应对齐
    return (
      <div id="page">
        <Layout style={{ minHeight: '100vh' }}>
          {/* left sider */}
          <Layout.Sider
            collapsible
            trigger={null}
            collapsed={this.state.collapsed}
            collapsedWidth={0}>
            {/* nav */}
            <SiderNav />
          </Layout.Sider>

          {/* right sider */}
          <Layout>
            <Layout.Header style={{ background: '#fff', padding: '0 16px' }}>
              <HeaderBar
                collapsed={this.state.collapsed}
                onToggle={this.toggle}
              />
            </Layout.Header>

            {/* right content */}
            <Layout.Content>{/* <ContentMain/> */}</Layout.Content>

            {/* footer */}
            <Layout.Footer style={{ textAlign: 'center' }} />
          </Layout>
        </Layout>
      </div>
    )
  }
}

export default Index
