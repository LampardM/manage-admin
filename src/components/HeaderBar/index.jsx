/*
 * @Description: HeaderBar
 * @Author: jieq
 * @Date: 2020-04-16 01:31:45
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-07-17 20:42:57
 */
/** officail */
import React from 'react'
import { inject, observer } from 'mobx-react'
import { Link, withRouter } from 'react-router-dom'

/** vendor */
import styled from 'styled-components'
import { Row, Col, Badge, Dropdown, Menu } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined, NotificationOutlined } from '@ant-design/icons'

/** custom */
import { getNickName, isAuthenticated } from '@/utils/session'
import { getUserMessages } from '@/api/user'

/**
 * @desc 轮询间隔时间
 * @default 60s
 * @type {number}
 */
const POLLING_DELAY = 1000 * 60 * 2

//withRouter一定要写在前面，不然路由变化不会反映到props中去
@withRouter
@observer
@inject('userInfoStore')
class HeaderBar extends React.Component {
  state = {
    // icon: 'arrows-alt',
    count: 0,
    messageLists: [],
    visible: false
    // avatar: require('./img/04.jpg'),
  }

  polling = null //轮询timer

  componentWillMount() {
    this.pollingMessage()
    this.polling = setInterval(this.pollingMessage, POLLING_DELAY)
  }

  pollingMessage = () => {
    console.log('polling to pull message...')
    getUserMessages({
      timestamp: JSON.stringify(new Date().getTime()),
      token: this.props.userInfoStore.token,
      version: this.props.userInfoStore.version
    })
      .then(res => {
        console.log(res, 'messages')

        this.setState({
          messageLists: (res || {}).data || [],
          count: ((res || {}).data || []).length
        })
      })
      .catch(err => console.log(err))
  }

  componentDidMount() {}

  componentWillUnmount() {
    this.polling && clearInterval(this.polling)
  }

  toggle = () => {
    this.props.onToggle()
  }

  logout = () => {
    this.props.userInfoStore.toggleLogin(false)
    this.props.history.push('/login')
  }

  userInfoHandler = item => {
    if (item.key === 'logout') {
      this.logout()
    }
  }

  messageHandler = item => {
    this.props.history.push(`/home/notice/${item.key}`)
  }

  menu = () => {
    return (
      <Menu className="menu" onClick={this.userInfoHandler}>
        <Menu.ItemGroup title="用户中心" className="menu-group">
          <Menu.Item key={isAuthenticated()}>你好 - {getNickName()}</Menu.Item>
          {/* <Menu.Item key="userInfo">个人信息</Menu.Item> */}
          <Menu.Item key="logout">退出登录</Menu.Item>
        </Menu.ItemGroup>
        {/* <Menu.ItemGroup title="设置中心" className="menu-group">
          <Menu.Item>个人设置</Menu.Item>
          <Menu.Item>系统设置</Menu.Item>
        </Menu.ItemGroup> */}
      </Menu>
    )
  }

  notLogin = () => {
    const { location } = this.props

    return (
      <div>
        <Link
          to={{ pathname: '/login', state: { from: location } }}
          style={{ color: 'rgba(0, 0, 0, 0.65)' }}
        >
          登录
        </Link>
        &nbsp;
        {/* <img src={require('../../assets/img/defaultUser.jpg')} alt='' /> */}
      </div>
    )
  }

  login = () => {
    return (
      <Dropdown overlay={this.menu()}>
        <span style={{ cursor: 'pointer' }}>{getNickName()}</span>
      </Dropdown>
    )
  }

  message = () => {
    const { count } = this.state
    const { userInfoStore } = this.props

    if (userInfoStore.isLogin && count) {
      return (
        <Dropdown overlay={this.renderMessageList()}>
          <Badge
            count={userInfoStore.isLogin ? count : 0}
            overflowCount={99}
            style={{ marginRight: -17 }}
          >
            <NotificationOutlined />
          </Badge>
        </Dropdown>
      )
    } else {
      return <NotificationOutlined />
    }
  }

  renderMessageList = () => {
    return (
      <Menu className="menu" onClick={this.messageHandler}>
        <Menu.ItemGroup style={{ maxHeight: 200, overflow: 'auto' }}>
          {this.state.messageLists.map(it => (
            <Menu.Item key={it.code}>
              <Row
                flex="auto"
                align="center"
                justify="space-between"
                className="header-ul"
                style={{ width: 250 }}
                gutter={{ xs: 8, sm: 16, md: 24 }}
              >
                <Col
                  flex="auto"
                  span={16}
                  style={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{it.title}</div>
                  <div>{it.content}</div>
                </Col>
                <Col
                  span={8}
                  offset={0}
                  flex="auto"
                  style={{ fontSize: '12px', color: '#999', textAlign: 'right' }}
                >
                  {it.showTime}
                </Col>
              </Row>
            </Menu.Item>
          ))}
        </Menu.ItemGroup>
      </Menu>
    )
  }

  render() {
    const { className, userInfoStore, collapsed } = this.props

    return (
      <div className={className}>
        <Row align="center" justify="space-between">
          {collapsed ? (
            <MenuUnfoldOutlined className="trigger" onClick={this.toggle} />
          ) : (
            <MenuFoldOutlined className="trigger" onClick={this.toggle} />
          )}
          <Row flex="auto" align="center" justify="center" className="header-ul">
            <Col align="center" justify="center" className="item">
              {this.message()}
            </Col>
            <Col align="center" justify="center" className="item">
              {userInfoStore.isLogin ? this.login() : this.notLogin()}
            </Col>
          </Row>
        </Row>
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
    cursor: pointer;
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
