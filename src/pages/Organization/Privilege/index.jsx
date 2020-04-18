/**
 * @Desc In User Settings Edit
 * @exports class
 * @Author jieq
 * @Date 2020-04-19 00:18:10
 * @LastEditors jieq
 * @LastEditTime 2020-04-19 00:19:30
 */
import React from 'react'
import styled from 'styled-components'

class PrivilegePage extends React.Component {
  render() {
    return (
      <div className={this.props.className}>
        <div className="page-title">授权</div>
        <div className="container"></div>
      </div>
    )
  }
}

export default styled(PrivilegePage)`
  margin-top: -16px;

  .page-title {
    font-size: 20px;
    font-weight: bold;
    padding: 0 16px 10px;
    background-color: #fff;
  }

  .container {
    margin: 16px;
    padding: 16px;
    background: #fff;
  }
`
