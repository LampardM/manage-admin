/**
 * @Desc In User Settings Edit
 * @exports class
 * @Author jieq
 * @Date 2020-04-18 12:11:39
 * @LastEditors jieq
 * @LastEditTime 2020-04-19 00:47:36
 */
/** offcial */
import React from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

/** custom */
import Enhance from '../../../Enhance'

/** ui */
import TableData from './TableData'
import FilterForm from './FilterForm'

@withRouter
@observer
@Enhance
class AuthPage extends React.Component {
  render() {
    return (
      <div className={this.props.className}>
        <div className="page-title">待授权</div>
        <div className="container">
          <FilterForm />
          <TableData go={this.go.bind(this)} />
        </div>
      </div>
    )
  }
}

export default styled(AuthPage)`
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
