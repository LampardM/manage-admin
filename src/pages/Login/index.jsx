/*
 * @Description: 登录/注册页
 * @Author: longzhang6
 * @Date: 2020-04-11 16:05:09
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-13 23:54:14
 */
import React from "react";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";
import "./style.css";
// import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
// import { login } from "@/api/user";

@withRouter
@observer
@inject("appStore")
class Login extends React.Component {
  state = {
    showBox: "register",
  };
  componentDidMount() {
    // login().then(() => {});
  }

  switchShowBox() {}

  render() {
    const { showBox } = this.state;
    return (
      <div id="login-page">
        <div className="login-container">
          {/* <LoginForm
            className={showBox === "login" ? "box showBox" : "box hiddenBox"}
            switchShowBox={this.switchShowBox}
          /> */}
          <RegisterForm
            className={showBox === "register" ? "box showBox" : "box hiddenBox"}
            switchShowBox={this.switchShowBox}
          />
        </div>
      </div>
    );
  }
}

const styles = {};

export default Login;
