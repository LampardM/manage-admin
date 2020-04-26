/*
 * @Description: 创建团队
 * @Author: longzhang6
 * @Date: 2020-04-26 09:23:00
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-26 09:41:21
 */
import React from 'react'
import styled from 'styled-components'
import CreateDepartForm from './CreateDepartForm'

class Create extends React.Component {
  render() {
    const { className } = this.props

    return (
      <div className={className} style={{ padding: '0 16 16', marginTop: -16 }}>
        <div className="create-container">
          <div className="create-title">创建团队</div>
          <CreateDepartForm></CreateDepartForm>
        </div>
      </div>
    )
  }
}

export default styled(Create)`
  .create-container {
  }

  .create-title {
    font-weight: bold;
    font-size: 20px;
    padding: 0 16px 10px;
    background-color: #fff;
  }
`
