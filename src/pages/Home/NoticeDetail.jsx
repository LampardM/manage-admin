/*
 * @Description: 通知详情
 * @Author: longzhang6
 * @Date: 2020-04-26 10:28:03
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-26 11:29:55
 */
import React, { useState, useEffect } from 'react'
import { Button, Space, Divider, Message, Modal } from 'antd'
import styled from 'styled-components'
import { useHistory, useParams } from 'react-router-dom'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { CopyToClipboard } from 'react-copy-to-clipboard'

/** custom */
import { urlPrefix } from '@/constants'
import { refuseInvitation } from '@/api'
import { useStore } from '@/hooks/useStore'

const { confirm } = Modal

const NoticeDetail = () => {
  const { id } = useParams()
  const history = useHistory()
  const { userInfoStore } = useStore()

  const [inviteUrl, setInviteUrl] = useState(`${urlPrefix}/joindepart/${id}`)
  const [copied, setCopied] = useState(false)
  const [disableJoin, setDisableJoin] = useState(false)

  const copyInviteUrl = () => {
    // TODO 服务端将此链接标示置为失效
    setCopied(true)
    if (disableJoin) {
      Message.error('该链接已失效')
    } else {
      Message.success('链接复制成功！')
    }
  }

  const refusedInvite = () => {
    confirm({
      title: '确认拒绝该邀请么?',
      icon: <ExclamationCircleOutlined />,
      content: '拒绝后该邀请链接失效，不能再通过此链接加入',
      onOk() {
        console.log('OK')
        refuseInvitation({
          param: id,
          token: userInfoStore.token,
          version: userInfoStore.version,
          timestamp: JSON.stringify(new Date().getTime())
        }).then(() => {
          setDisableJoin(true)
        })
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  const acceptInvite = () => {
    history.push(`/joindepart/${id}`)
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
              <Button onClick={refusedInvite} disabled={disableJoin}>
                拒绝
              </Button>
              <Button type="primary" onClick={acceptInvite} disabled={disableJoin}>
                加入
              </Button>
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
