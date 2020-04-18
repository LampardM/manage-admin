/*
 * @Description: 组织架构
 * @Author: jieq
 * @Date: 2020-04-16 23:09:31
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-18 17:55:35
 */
import React from 'react'
import styled from 'styled-components'
import ArchitectureContent from './ArchitectureContent'

class ArchitecturePage extends React.Component {
  render() {
    const { className } = this.props

    return (
      <div className={className} style={{ padding: '0 16 16', marginTop: -16 }}>
        <div className="arch-container">
          <div className="arch-title">组织架构</div>
          <ArchitectureContent></ArchitectureContent>
        </div>
      </div>
    )
  }
}

export default styled(ArchitecturePage)`
  .arch-container {
  }

  .arch-title {
    font-weight: bold;
    font-size: 20px;
    padding: 0 16px 10px;
    background-color: #fff;
  }
`
