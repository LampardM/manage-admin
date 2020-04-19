/**
 * @Desc In User Settings Edit
 * @exports class
 * @Author jieq
 * @Date 2020-04-18 12:11:39
 * @LastEditors jieq
 * @LastEditTime 2020-04-18 23:22:42
 */
/** offcial */
import React from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

/** ui */
import TableData from './TableData'
import FilterForm from './FilterForm'

@withRouter
@observer
class CheckPage extends React.Component {
  render() {
    return (
      <div className={this.props.className}>
        <div className="page-title">待审核</div>
        <div className="container">
          <FilterForm />
          <TableData />
        </div>
      </div>
    )
  }
}

export default styled(CheckPage)`
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
