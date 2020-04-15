/*
 * @Description: 注册组件
 * @Author: longzhang6
 * @Date: 2020-04-13 22:23:37
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-15 19:21:34
 */
import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button } from "antd";
import { useStore } from "@/hooks/useStore";
import { observer } from "mobx-react";

const { Option } = Select;

const RegisterForm = () => {
  const { userInfoStore } = useStore();
  const [form] = Form.useForm();
  const [, forceUpdate] = useState(); // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);
  const onFinish = () => {};

  const onFinishFailed = () => {};

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="86">+86</Option>
      </Select>
    </Form.Item>
  );

  const afterSelector = (
    <Form.Item noStyle shouldUpdate>
      {() => (
        <div
          className="register-verify"
          disabled={
            !form.isFieldTouched("phone") ||
            !form.isFieldTouched("password") ||
            !form.isFieldTouched("confirm") ||
            form.getFieldsError().filter(({ errors }) => errors.length).length
          }
        >
          获取验证码
        </div>
      )}
    </Form.Item>
  );

  console.log(userInfoStore.isLogin);

  return (
    <div className="register-container">
      <h3 className="title">注册</h3>
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
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
            addonBefore={prefixSelector}
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
          <Input
            placeholder="请输入验证码"
            size="large"
            addonAfter={afterSelector}
          />
        </Form.Item>
        <Form.Item shouldUpdate>
          {() => (
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              disabled={
                !form.isFieldTouched("phone") ||
                !form.isFieldTouched("password") ||
                !form.isFieldTouched("confirm") ||
                !form.isFieldTouched("Verification") ||
                form.getFieldsError().filter(({ errors }) => errors.length)
                  .length
              }
              className="register-button"
            >
              注册{JSON.stringify(form.isFieldTouched("password"))}
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

export default observer(RegisterForm);
