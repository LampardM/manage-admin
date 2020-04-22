/*
 * @Description: 成员管理
 * @Author: jieq
 * @Date: 2020-04-16 23:10:57
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-22 22:38:28
 */
import React from 'react'
import styled from 'styled-components'
import MemberHeader from './MemberHeader'
import FilterMember from './FilterMember'
import MemberTable from './MemberTable'
import { withRouter } from 'react-router-dom'
import { Button, Space } from 'antd'
@withRouter
class MemberPage extends React.Component {
  switchCurSource(key) {}

  addMember() {
    this.props.history.push('/team/member/addmember')
  }

  render() {
    const { className } = this.props
    return (
      <div className={className} style={{ padding: '0 16 16', marginTop: -16 }}>
        <div className="member-container">
          <div className="member-title">成员管理</div>
          <MemberHeader switchCurSource={this.switchCurSource} />
          <div className="member-con">
            <FilterMember></FilterMember>
            <div className="add-remove">
              <Space>
                <Button type="primary" onClick={this.addMember.bind(this)}>
                  添加成员
                </Button>
                <Button>删除</Button>
              </Space>
            </div>
            <MemberTable></MemberTable>
          </div>
        </div>
      </div>
    )
  }
}

export default styled(MemberPage)`
  .member-container {
  }

  .member-title {
    font-weight: bold;
    font-size: 20px;
    padding: 0 16px 10px;
    background-color: #fff;
  }

  .member-con {
    margin: 16px;
    padding: 16px;
    background: #fff;
  }

  .add-remove {
    padding-bottom: 16px;
  }
`
