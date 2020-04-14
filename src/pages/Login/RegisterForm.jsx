/*
 * @Description: 注册组件
 * @Author: longzhang6
 * @Date: 2020-04-13 22:23:37
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-14 23:23:12
 */
import React from "react";
import { Form, Input, Select, Button } from "antd";
import { inject, observer } from "mobx-react";

const { Option } = Select;

@observer
@inject("appStore")
class RegisterForm extends React.Component {
  state = {};
  formRef = React.createRef();

  onFinish = (values) => {
    console.log("Success:", values);
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );

  componentDidMount() {}

  render() {
    return (
      <div className={this.props.className}>
        <h3 className="title">注册</h3>
        <Form
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          ref={this.formRef}
          initialValues={{
            prefix: "86",
          }}
        >
          <Form.Item
            name="phone"
            rules={[
              {
                required: true,
                message: "请输入手机号码",
              },
              {
                pattern: "^1[345789][0-9]{9}$",
                message: "请输入正确的手机号",
              },
            ]}
          >
            <Input
              size="large"
              placeholder="请输入手机号码"
              addonBefore={this.prefixSelector}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "请输入登录密码!",
              },
              {
                pattern: "^[A-Za-z0-9!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~]+$",
                message: "密码包含数字字母和常用特殊符号",
              },
              {
                max: 16,
                min: 6,
                message: "密码长度为6到16位",
              },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="请输入登录密码" size="large" />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "请输入密码!",
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject("两次输入密码不一致!");
                },
              }),
            ]}
          >
            <Input.Password placeholder="请确认登录密码" size="large" />
          </Form.Item>
          <Form.Item
            name="Verification"
            rules={[
              {
                required: true,
                message: "请输入验证码!",
              },
              {
                pattern: "^[0-9]+$",
                message: "验证码有误，请重新输入",
              },
            ]}
          >
            <Input placeholder="请输入验证码" size="large" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              disabled={
                (this.formRef.current &&
                  !this.formRef.current.isFieldsTouched(true)) ||
                (this.formRef.current &&
                  this.formRef.current
                    .getFieldsError()
                    .filter(({ errors }) => errors.length).length)
              }
              className="register-button"
            >
              注册
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default RegisterForm;
