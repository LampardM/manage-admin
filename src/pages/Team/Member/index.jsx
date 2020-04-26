/*
 * @Description: 成员管理
 * @Author: jieq
 * @Date: 2020-04-16 23:10:57
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-26 09:00:24
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
  state = {
    curselect: 'joined'
  }
  switchCurSource(key) {
    this.setState({
      curselect: key
    })
  }

  addMember() {
    this.props.history.push('/team/member/addmember')
  }

  render() {
    const { className } = this.props
    const { curselect } = this.state

    return (
      <div className={className} style={{ padding: '0 16 16', marginTop: -16 }}>
        <div className="member-container">
          <div className="member-title">成员管理</div>
          <MemberHeader switchCurSource={this.switchCurSource.bind(this)} />
          <div className="member-con">
            <FilterMember curselect={curselect}></FilterMember>
            {curselect === 'joined' ? (
              <div className="add-remove">
                <Space>
                  <Button type="primary" onClick={this.addMember.bind(this)}>
                    添加成员
                  </Button>
                  <Button>删除</Button>
                </Space>
              </div>
            ) : (
              <div className="add-remove">
                <Space>
                  <Button type="primary" onClick={this.addMember.bind(this)}>
                    再发送
                  </Button>
                  <Button>取消邀请</Button>
                </Space>
              </div>
            )}

            <MemberTable curselect={curselect}></MemberTable>
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
