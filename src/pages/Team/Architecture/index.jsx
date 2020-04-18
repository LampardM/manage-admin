/*
 * @Description: 组织架构
 * @Author: jieq
 * @Date: 2020-04-16 23:09:31
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-18 15:45:11
 */
import React from 'react'
import styled from 'styled-components'

class ArchitecturePage extends React.Component {
  render() {
    const { className } = this.props

    return (
      <div className={className}>
        <div className="arch-container">
          <div className="arch-title">组织架构</div>
        </div>
      </div>
    )
  }
}

export default styled(ArchitecturePage)`
  .arch-container {
    background-color: #fff;
    padding: 0 16px 16px;
    margin-top: -16px;
  }
  .arch-title {
    font-weight: bold;
    font-size: 20px;
  }
`
