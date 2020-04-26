/*
 * @Description: 通知详情
 * @Author: longzhang6
 * @Date: 2020-04-26 10:28:03
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-26 11:14:53
 */
import React, { useState, useEffect } from 'react'
import { Button, Space, Divider, Message } from 'antd'
import styled from 'styled-components'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const NoticeDetail = () => {
  const [inviteUrl, setInviteUrl] = useState('www.baidu.com')
  const [copied, setCopied] = useState(false)

  const copyInviteUrl = () => {
    setCopied(true)
    Message.success('链接复制成功！')
  }

  return (
    <div style={{ padding: '0 16 16', marginTop: -16 }}>
      <NoticeContainer>
        <div className="notice-title">通知详情</div>
      </NoticeContainer>
      <NoticeInfo>
        <NoticeHeader>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>团队邀请</div>
          <div>
            <Space>
              <Button>拒绝</Button>
              <Button type="primary">加入</Button>
            </Space>
          </div>
        </NoticeHeader>
        <Divider></Divider>
        <NoticeInfoDetail>
          <DetailTitle>来自浙江xx公司的邀请</DetailTitle>
          <div>
            <p>同意，请点击加入按钮，执行加入操作；</p>
            <p>不同意，请点击拒绝；点击拒绝按钮后，无法再通过该通知加入团队；</p>
            <p>
              如果使用其它帐户加入团队，请复制以下加入链接，切换帐户后，在浏览器中输入邀请链接加入
            </p>
            <div>
              <Space>
                <span>邀请链接:</span>
                <InviteUrlCon>{inviteUrl}</InviteUrlCon>
                <CopyToClipboard text={inviteUrl} onCopy={copyInviteUrl}>
                  <Button size="small">复制</Button>
                </CopyToClipboard>
              </Space>
            </div>
          </div>
        </NoticeInfoDetail>
      </NoticeInfo>
    </div>
  )
}

const NoticeContainer = styled.div`
  font-weight: bold;
  font-size: 20px;
  padding: 0 16px 10px;
  background-color: #fff;
`

const NoticeInfo = styled.div`
  margin: 16px;
  padding: 16px;
  background: #fff;
`

const NoticeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
`

const NoticeInfoDetail = styled.div``

const DetailTitle = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  padding-bottom: 30px;
`

const InviteUrlCon = styled.a`
  max-width: 400px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export default NoticeDetail
