/*
 * @Description: 添加角色
 * @Author: longzhang6
 * @Date: 2020-05-06 21:56:25
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-05-06 22:13:13
 */
import React from 'react'
import styled from 'styled-components'
import AddEditCharacterForm from './AddEditCharacterForm'
import { withRouter } from 'react-router-dom'
@withRouter
class AddCharacter extends React.Component {
  render() {
    const { className } = this.props

    return (
      <div className={className} style={{ padding: '0 16 16', marginTop: -16 }}>
        <div className="addcharacter-container">
          <div className="addcharacter-title">添加角色</div>
          <div className="addcharacter-con">
            <AddEditCharacterForm></AddEditCharacterForm>
          </div>
        </div>
      </div>
    )
  }
}

export default styled(AddCharacter)`
  .addcharacter-title {
    font-weight: bold;
    font-size: 20px;
    padding: 0 16px 10px;
    background-color: #fff;
  }

  .addcharacter-con {
    margin: 16px;
    padding: 16px;
    background: #fff;
  }
`
