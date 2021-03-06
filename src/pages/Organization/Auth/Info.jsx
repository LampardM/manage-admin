/**
 * @Desc 授权
 * @exports class
 * @Author jieq
 * @Date 2020-04-19 00:18:10
 * @LastEditors jieq
 * @LastEditTime 2020-04-22 01:00:43
 */
/** offcial */
import React from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

/** custom */
import Enhance from '../../../Enhance'

/** ui */
import Contianer from './Contianer'

@withRouter
@observer
@Enhance
class AuthInfoPage extends React.Component {
  constructor(props) {
    super(props)
    console.log(`url query id: `, this.urlQuery('id'))
  }

  render() {
    return (
      <div className={this.props.className}>
        <div className="page-title">授权</div>
        <div className="container">
          <Contianer />
        </div>
      </div>
    )
  }
}

export default styled(AuthInfoPage)`
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
