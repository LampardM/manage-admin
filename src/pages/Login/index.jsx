/*
 * @Description: 登录/注册页
 * @Author: longzhang6
 * @Date: 2020-04-11 16:05:09
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-16 22:42:11
 */
import React from 'react'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
// import { login } from "@/api/user";

@withRouter
@observer
@inject('userInfoStore')
class Login extends React.Component {
  state = {
    showBox: 'register'
  }
  componentDidMount() {
    // login().then(() => {});
  }

  switchShowBox() {}

  render() {
    const { showBox } = this.state
    const { className } = this.props
    return (
      <div className={className}>
        <div id="login-page">
          <div className="container">
            {showBox === 'register' ? (
              <RegisterForm
                switchShowBox={this.switchShowBox}
                showBox={showBox}
              />
            ) : (
              <LoginForm switchShowBox={this.switchShowBox} showBox={showBox} />
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default styled(Login)`
  #login-page {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #283443;
    z-index: 99;
  }

  .container {
    width: 380px;
  }
`
