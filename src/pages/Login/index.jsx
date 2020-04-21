/*
 * @Description: 登录/注册页
 * @Author: longzhang6
 * @Date: 2020-04-11 16:05:09
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-22 00:46:30
 */
import React from 'react'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import 'animate.css'

// import { login } from "@/api/user";

@withRouter
@observer
@inject('userInfoStore')
class Login extends React.Component {
  state = {
    showBox: 'login'
  }
  componentDidMount() {
    // login().then(() => {});
  }

  switchShowBox = curbox => {
    if (curbox === 'forgotpassword') {
      this.props.history.push('/forgotpassword')
    } else {
      this.setState({
        showBox: curbox
      })
    }
  }

  render() {
    const { showBox } = this.state
    const { className } = this.props

    return (
      <div className={className}>
        <div id="login-page">
          <div className="container">
            {showBox === 'register' ? (
              <div className="animated slideInLeft animated-content">
                <RegisterForm switchShowBox={this.switchShowBox} showBox={showBox} />
              </div>
            ) : (
              <div className="animated fadeInLeft animated-content">
                <LoginForm switchShowBox={this.switchShowBox} showBox={showBox} />
              </div>
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
    background: #fff;
    z-index: 99;
  }

  .container {
    // width: 420px;
  }

  .animated-content {
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 3px 3px #f0f0f0;
  }
`
