/**
 * @Desc table数据
 * @exports class
 * @Author jieq
 * @Date 2020-04-19 15:38:09
 * @LastEditors jieq
 * @LastEditTime 2020-05-10 01:42:07
 */
/** official */
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { useHistory, useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'

/** custom */
import { useStore } from '@/hooks/useStore'
import { empower, getAuthorizableAppMenu } from '@/api'

/** ui */
import { Row, Col, Modal, Button, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import TableCheckBox from '../../../components/TableCheckBox'

// const allNode = [
//   'managementFunction', //管理功能
//   'teamManagement', //团队管理
//   'IOTDeviceManagement', //IOT设备管理
//   'organizationalStructure', //组织架构
//   'memberManagement', //成员管理
//   'characterManagement', //角色管理
//   'agreementSetting', //协议设置
//   'onlineDevices', //在线设备
//   'allDevices' //全部设备
// ]

const Privilege = ({ className }) => {
  const { id } = useParams()
  const history = useHistory()
  const { userInfoStore } = useStore()

  const [tableData, setTableData] = useState([])
  const [submitable, setSubmitable] = useState(false)
  const [checkedList, setCheckedList] = useState([])
  const [isTableLoading, setIsTableLoading] = useState(true)

  useEffect(() => {
    fetch()
  }, [])

  const fetch = () => {
    setIsTableLoading(true)
    getAuthorizableAppMenu({
      param: id,
      token: userInfoStore.token,
      version: userInfoStore.version,
      timestamp: JSON.stringify(new Date().getTime())
    })
      .then(({ data }) => {
        // console.log(data)
        setTableData(data)
      })
      .finally(() => setIsTableLoading(false))

    // setTimeout(() => {
    //   setTableData([
    //     {
    //       key: 'managementFunction',
    //       value: '管理功能',
    //       subs: [
    //         {
    //           key: 'teamManagement',
    //           value: '团队管理',
    //           checked: true,
    //           subs: [
    //             {
    //               key: 'organizationalStructure',
    //               value: '组织架构'
    //             },
    //             {
    //               key: 'memberManagement',
    //               value: '成员管理'
    //             },
    //             {
    //               key: 'characterManagement',
    //               value: '角色管理'
    //             }
    //           ]
    //         },
    //         {
    //           key: 'IOTDeviceManagement',
    //           value: 'IOT设备管理',
    //           subs: [
    //             {
    //               key: 'agreementSetting',
    //               value: '协议设置'
    //             },
    //             {
    //               key: 'onlineDevices',
    //               value: '在线设备'
    //             },
    //             {
    //               key: 'allDevices',
    //               value: '全部设备',
    //               checked: true
    //             }
    //           ]
    //         }
    //       ]
    //     }
    //   ])
    //   setIsTableLoading(false)
    // }, 1000)
  }

  const onChange = (value, isChecked, tailCollection, allCollection, nodeData) => {
    if (!submitable) {
      setSubmitable(true)
    }
    setCheckedList(tailCollection)
  }

  const handleCancel = () => {
    Modal.confirm({
      title: `确认离开？`,
      icon: <ExclamationCircleOutlined />,
      content: `是否确认放弃已编辑内容`,
      onOk() {
        console.log('OK')
        history.goBack()
      }
    })
  }

  const handleSubmit = () => {
    empower({
      token: userInfoStore.token,
      version: userInfoStore.version,
      timestamp: JSON.stringify(new Date().getTime()),
      param: {
        appMenuCodes: checkedList,
        targetOrgCode: id
      }
    }).then(({ success }) => {
      if (+success === 1) {
        message.success('授权成功！', 3, () => {
          history.push(`/organization/approve`)
        })
      }
    })
  }

  return (
    <div className={className}>
      <TableCheckBox
        bordered
        className="table"
        pagination={false}
        showAllChecked={true}
        loading={isTableLoading}
        rowKey={(row, idx, self) => {
          // console.log('rowKey', row)
          return idx
        }}
        onChange={onChange}
        columns={[
          {
            title: '功能分类',
            dataIndex: 'function'
          },
          {
            title: '一级菜单',
            dataIndex: 'first'
          },
          {
            title: '二级菜单',
            dataIndex: 'second'
          }
        ]}
        nodeData={tableData}
      />
      <Row justify={'end'} style={{ marginTop: 20 }}>
        <Col>
          <Button onClick={handleCancel}>取消</Button>
          <Button
            type="primary"
            style={{ marginLeft: 10 }}
            disabled={!submitable}
            onClick={handleSubmit}
          >
            确定
          </Button>
        </Col>
      </Row>
    </div>
  )
}

export default observer(styled(Privilege)`
  padding-top: 20px;

  .table {
    margin-top: 20px;
  }
`)
