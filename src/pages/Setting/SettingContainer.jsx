/*
 * @Description: 团队设置
 * @Author: longzhang6
 * @Date: 2020-04-26 14:04:50
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-26 15:23:01
 */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Layout, Menu } from 'antd'
import VerifyCurAccountPhone from './VerifyAccountPhone'
import VerifyNewAccountPhone from './VerifyNewAccountPhone'
const { Content, Sider } = Layout

const SettingContainer = () => {
  const [selected, setSelected] = useState('transform')
  const [steps, setSteps] = useState('verifycur')

  const changeCurKind = item => {
    setSelected(item.key)
  }

  const nextVerifyNewAccount = () => {
    setSteps('verifynew')
  }

  return (
    <SettingContent>
      <Layout>
        <Sider width={200} theme={'light'}>
          <Menu mode="inline" defaultSelectedKeys={selected} onClick={changeCurKind}>
            <Menu.Item key="info" disabled>
              团队信息
            </Menu.Item>
            <Menu.Item key="type" disabled>
              团队类型
            </Menu.Item>
            <Menu.Item key="transform">团队转让</Menu.Item>
            <Menu.Item key="agency" disabled>
              签约信息
            </Menu.Item>
          </Menu>
        </Sider>
        <Content style={{ backgroundColor: ' #fff' }}>
          <TransformCon>
            <ContentTitle>团队转让</ContentTitle>
            {steps === 'verifycur' ? (
              <>
                <TransformInfo>团队转让需要手机验证码</TransformInfo>
                <VerifyCurAccountPhone
                  nextVerifyNewAccount={nextVerifyNewAccount}
                ></VerifyCurAccountPhone>
              </>
            ) : (
              <>
                <TransformInfo>请输入对方账户绑定的手机号码并验证</TransformInfo>
                <VerifyNewAccountPhone></VerifyNewAccountPhone>
              </>
            )}
          </TransformCon>
        </Content>
      </Layout>
    </SettingContent>
  )
}

const SettingContent = styled.div`
  margin: 16px;
  background: #fff;
  padding: 30px;
`

const TransformCon = styled.div`
  background: #fff;
  padding: 0 16px;
`

const TransformInfo = styled.div`
  background: #f0f0f0;
  padding: 5px;
  margin: 5px 0;
`

const ContentTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
`

export default SettingContainer
