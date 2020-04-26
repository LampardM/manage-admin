/*
 * @Description: 团队设置
 * @Author: longzhang6
 * @Date: 2020-04-26 13:57:25
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-26 14:06:06
 */
import React from 'react'
import styled from 'styled-components'
import SettingContainer from './SettingContainer'

class Settings extends React.Component {
  render() {
    const { className } = this.props
    return (
      <div className={className} style={{ padding: '0 16 16', marginTop: -16 }}>
        <div className="setting-container">
          <div className="setting-title">团队设置</div>
          <SettingContainer></SettingContainer>
        </div>
      </div>
    )
  }
}

export default styled(Settings)`
  .setting-title {
    font-weight: bold;
    font-size: 20px;
    padding: 0 16px 10px;
    background-color: #fff;
  }
`
