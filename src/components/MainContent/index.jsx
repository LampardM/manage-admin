/**
 * @Desc 后台Main路由
 * @exports MainContent
 * @Author jieq
 * @Date 2020-04-16 22:30:43
 * @LastEditors jieq
 * @LastEditTime 2020-04-21 00:48:45
 */
import React, { useState, useEffect } from 'react'
import Breadcrumb from '../Breadcrumb'
import PrivateRoute from '../PrivateRoute'
import navMenus from '../../router.map'
import { Ext, LoadableComponent } from '@/utils'
import { withRouter, Switch, Redirect } from 'react-router-dom'

//首页
const Home = LoadableComponent(() => import('@/pages/Home'))
//通知详情
const NoticeDetail = LoadableComponent(() => import('@/pages/Home/NoticeDetail'))

//创建团队
const Create = LoadableComponent(() => import('@/pages/Create'))

//团队审核
const OrganizationAuth = LoadableComponent(() => import('@/pages/Organization/Auth')) //待授权
const OrganizationCheck = LoadableComponent(() => import('@/pages/Organization/Check')) //待审核
const OrganizationReject = LoadableComponent(() => import('@/pages/Organization/Reject')) //已驳回
const OrganizationApprove = LoadableComponent(() => import('@/pages/Organization/Approve')) //已通过
const OrganizationAuthInfo = LoadableComponent(() => import('@/pages/Organization/Auth/Info')) //功能权限
const OrganizationApproveEdit = LoadableComponent(() => import('@/pages/Organization/Approve/Edit')) //已通过编辑

//团队管理
const TeamMember = LoadableComponent(() => import('@/pages/Team/Member')) // 成员管理
const AddTeamMember = LoadableComponent(() => import('@/pages/Team/Member/AddMember')) // 添加成员
const EditTeamMember = LoadableComponent(() => import('@/pages/Team/Member/EditMember')) // 添加成员
const TeamCharacter = LoadableComponent(() => import('@/pages/Team/Character')) // 角色管理
const AddCharacter = LoadableComponent(() => import('@/pages/Team/Character/AddCharacter')) // 角色管理

const TeamArchitecture = LoadableComponent(() => import('@/pages/Team/Architecture')) // 组织架构

//终端管理
const TerminalOnline = LoadableComponent(() => import('@/pages/Terminal/Online')) // 在线设备
const TerminalDevices = LoadableComponent(() => import('@/pages/Terminal/Devices')) // 全部设备
const TerminalAgreement = LoadableComponent(() => import('@/pages/Terminal/Agreement')) // 协议设置

const Settings = LoadableComponent(() => import('@/pages/Setting')) // 团队设置

const NotFound = LoadableComponent(() => import('@/pages/404'))

const MainContent = ({ location }) => {
  const [breadcrumb, setBreadcrumb] = useState([])
  const { pathname } = location

  /** 动态面包屑处理 start */
  const getPath = () => {
    const menusJson = flattenNavMap(navMenus)
    setBreadcrumb(matchPath(pathname, menusJson))
  }

  const matchPath = (key, json) => {
    let breadcrumb = []
    Object.entries(json).forEach(([porp, val]) => {
      if (key.match(new RegExp(porp))) {
        breadcrumb.push(val.title)
      }
      if (val.subs) {
        breadcrumb = breadcrumb.concat(matchPath(key, val.subs))
      } else {
        return breadcrumb
      }
    })
    return breadcrumb
  }

  const flattenNavMap = array => {
    let arr = deepCopy(array)

    arr.forEach(it => {
      if (it.subs) {
        it.subs = flattenNavMap(it.subs)
      }
    })
    return Ext.arrayToJson(arr, 'key')
  }

  const deepCopy = data => {
    let dataTmp = undefined

    if (data === null || !(typeof data === 'object')) {
      dataTmp = data
    } else {
      dataTmp = data.constructor.name === 'Array' ? [] : {}

      for (let key in data) {
        dataTmp[key] = deepCopy(data[key])
      }
    }
    return dataTmp
  }
  /** 动态面包屑处理 end */

  console.log('pathname', pathname)
  useEffect(() => {
    getPath()
  }, [pathname])

  return (
    <div style={{ position: 'relative' }}>
      <Breadcrumb arr={breadcrumb} />

      <Switch>
        <PrivateRoute exact path="/home" component={Home} />
        <PrivateRoute exact path="/home/notice" component={NoticeDetail} />
        <PrivateRoute exact path="/create" component={Create} />

        <PrivateRoute exact path="/organization/auth" component={OrganizationAuth} />
        <PrivateRoute exact path="/organization/check" component={OrganizationCheck} />
        <PrivateRoute exact path="/organization/reject" component={OrganizationReject} />
        <PrivateRoute exact path="/organization/approve" component={OrganizationApprove} />
        <PrivateRoute exact path="/organization/auth/info" component={OrganizationAuthInfo} />
        <PrivateRoute exact path="/organization/approve/edit" component={OrganizationApproveEdit} />

        <PrivateRoute exact path="/team/member" component={TeamMember} />
        <PrivateRoute exact path="/team/member/addmember" component={AddTeamMember} />
        <PrivateRoute exact path="/team/member/editmember" component={EditTeamMember} />
        <PrivateRoute exact path="/team/character" component={TeamCharacter} />
        <PrivateRoute exact path="/team/character/add" component={AddCharacter} />
        <PrivateRoute exact path="/team/architecture" component={TeamArchitecture} />

        <PrivateRoute exact path="/terminal/online" component={TerminalOnline} />
        <PrivateRoute exact path="/terminal/devices" component={TerminalDevices} />
        <PrivateRoute exact path="/terminal/agreement" component={TerminalAgreement} />

        <PrivateRoute exact path="/setting" component={Settings} />

        <Redirect exact from="/" to="/home" />

        <PrivateRoute exact path="*" component={NotFound} />
      </Switch>
    </div>
  )
}

export default withRouter(MainContent)
