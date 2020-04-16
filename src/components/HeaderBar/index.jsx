/*
 * @Description: In User Settings Edit
 * @Author: jieq
 * @Date: 2020-04-16 01:31:45
 * @LastEditors: jieq
 * @LastEditTime: 2020-04-16 02:46:59
 */
/** officail */
import React from 'react'
import { inject, observer } from 'mobx-react'
import { Link, withRouter } from 'react-router-dom'

/** vendor */
import styled from 'styled-components'
import { Row, Col, Badge, Dropdown, Menu, Modal } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  NotificationOutlined
} from '@ant-design/icons'

/** custom */
import { isAuthenticated } from '../../utils/session'

//withRouter一定要写在前面，不然路由变化不会反映到props中去
@withRouter
@inject('userInfoStore')
@observer
class HeaderBar extends React.Component {
  state = {
    // icon: 'arrows-alt',
    count: 100,
    visible: false
    // avatar: require('./img/04.jpg'),
  }

  componentDidMount() {}

  componentWillUnmount() {}

  toggle = () => {
    this.props.onToggle()
  }

  logout = () => {
    this.props.userInfoStore.toggleLogin(false)
    this.props.history.push(this.props.location.pathname)
  }

  notLogin = () => {
    const { location } = this.props

    return (
      <div>
        <Link
          to={{ pathname: '/login', state: { from: location } }}
          style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
          登录
        </Link>
        &nbsp;
        {/* <img src={require('../../assets/img/defaultUser.jpg')} alt='' /> */}
      </div>
    )
  }

  login = () => {
    const { name = 'name' } = this.props.userInfoStore
    return (
      <Dropdown overlay={this.menu()}>
        <span onClick={() => this.setState({ visible: true })}>{name}</span>
      </Dropdown>
    )
  }

  menu = () => {
    return (
      <Menu className="menu">
        <Menu.ItemGroup title="用户中心" className="menu-group">
          <Menu.Item>你好 - {isAuthenticated()}</Menu.Item>
          <Menu.Item>个人信息</Menu.Item>
          <Menu.Item>
            <span onClick={this.logout}>退出登录</span>
          </Menu.Item>
        </Menu.ItemGroup>
        <Menu.ItemGroup title="设置中心" className="menu-group">
          <Menu.Item>个人设置</Menu.Item>
          <Menu.Item>系统设置</Menu.Item>
        </Menu.ItemGroup>
      </Menu>
    )
  }

  render() {
    const { /* icon, */ count, visible /* avatar */ } = this.state
    const { className, userInfoStore, collapsed } = this.props

    return (
      <div className={className}>
        <Row align="center" justify="space-between">
          {collapsed ? (
            <MenuUnfoldOutlined className="trigger" onClick={this.toggle} />
          ) : (
            <MenuFoldOutlined className="trigger" onClick={this.toggle} />
          )}
          <Row
            flex="auto"
            align="center"
            justify="center"
            className="header-ul">
            <Col
              align="center"
              justify="center"
              className="item"
              onClick={() => this.setState({ count: 0 })}>
              <Badge
                count={userInfoStore.isLogin ? count : 0}
                overflowCount={99}
                style={{ marginRight: -17 }}>
                <NotificationOutlined />
              </Badge>
            </Col>
            <Col align="center" justify="center" className="item">
              {userInfoStore.isLogin ? this.login() : this.notLogin()}
            </Col>
          </Row>
        </Row>

        <Modal
          footer={null}
          closable={false}
          visible={visible}
          wrapClassName="vertical-center-modal"
          onCancel={() => this.setState({ visible: false })}>
          {/* <img src={avatar} alt='' width='100%' /> */}
        </Modal>
      </div>
    )
  }
}

export default styled(HeaderBar)`
  .trigger {
    font-size: 18px;
    line-height: 64px;
    cursor: pointer;
  }
  .trigger:hover {
    color: #1890ff;
  }
  .item {
    padding: 0 20px;
  }
  .menu {
    line-height: 2em;
    padding: 0 10px;
  }
  .menu-group li {
    padding: 0 24px;
    line-height: 2em;
  }
`
