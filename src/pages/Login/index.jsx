/*
 * @Description: 登录/注册页
 * @Author: longzhang6
 * @Date: 2020-04-11 16:05:09
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-11 16:38:04
 */
import React from "react";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

@withRouter
@observer
@inject("appStore")
class Login extends React.Component {
  render() {
    return <div>login</div>;
  }
}

export default Login;
