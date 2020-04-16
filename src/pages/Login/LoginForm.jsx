/*
 * @Description: 登录组件
 * @Author: longzhang6
 * @Date: 2020-04-16 22:33:45
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-16 22:37:18
 */
import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button } from "antd";
import { observer } from "mobx-react";

const { Option } = Select;

const LoginForm = () => {
  const [form] = Form.useForm();
  const [loginType, setLoginType] = useState("password");
  const [, forceUpdate] = useState();

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

  useEffect(() => {
    forceUpdate({});
  }, []);

  return <div>login</div>;
};

export default observer(LoginForm);
