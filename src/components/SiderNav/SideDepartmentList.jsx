/*
 * @Description: nav团队列表
 * @Author: longzhang6
 * @Date: 2020-05-13 22:13:14
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-07-22 14:10:51
 */
import React, { useState, useEffect } from 'react'
import { Select, message } from 'antd'
import { useStore } from '@/hooks/useStore'
import { useLocalStorageState } from '@umijs/hooks'
import { switchDepartment } from '@/api/department'
import { useHistory } from 'react-router-dom'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { setNickName, setCurDepart, getCurDepart } from '@/utils/session'
import styled from 'styled-components'

const { Option } = Select

const SideDepartmentList = props => {
  const [userMenus, setUserMenus] = useLocalStorageState('user-menus')
  const [userStorageOrganizes, setStorageUserOrganizes] = useLocalStorageState('user-organizes')
  const { userInfoStore } = useStore()
  const [curValue, setCurValue] = useState('')
  const [userOrganizes, setUserOrganizes] = useState([])
  const history = useHistory()

  useEffect(() => {
    console.log(toJS(userInfoStore.userOrganizes), 'toJS(userInfoStore.userOrganizes)')
    setUserOrganizes(toJS(userInfoStore.userOrganizes))
  }, [userInfoStore.userOrganizes])

  useEffect(() => {
    setUserOrganizes(userStorageOrganizes)
  }, [])

  useEffect(() => {
    let _result
    if (userOrganizes && userOrganizes.length > 1) {
      _result = userOrganizes.find(depart => depart.code === getCurDepart())
      setCurValue(_result.name)
    } else {
      setCurValue('暂无团队')
    }
  }, [userOrganizes])

  const getCurDepartName = () => {
    let _result
    if (userOrganizes && userOrganizes.length > 1) {
      _result = userOrganizes.find(depart => depart.code === getCurDepart())
      return _result.name
    } else {
      return '暂无团队'
    }
  }

  const handleChange = (value, option) => {
    if (option.key === 'create') {
      history.push('/create')
    } else {
      let _params = {
        param: option.key,
        timestamp: JSON.stringify(new Date().getTime()),
        token: userInfoStore.token,
        version: userInfoStore.version
      }
      switchDepartment(_params)
        .then(_result => {
          setNickName(_result.data.nick)
          setUserMenus(_result.data.menus)
          setCurDepart([option.key])
          setCurValue(value)
          props.changeDepartment()
          message.success('切换团队成功！')
          history.push('/home')
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  return (
    <DepartmentCur>
      <Select
        defaultValue={getCurDepartName()}
        disabled={userOrganizes && userOrganizes.length === 0}
        style={{ width: 180 }}
        onChange={handleChange}
        value={curValue}
      >
        {userOrganizes &&
          userOrganizes.length &&
          userOrganizes.map((organization, idx) =>
            organization.code === 'create' ? (
              <Option
                value={organization.name}
                key={organization.code}
                style={{ fontSize: '13px' }}
              >
                {organization.name}
              </Option>
            ) : (
              <Option value={organization.name} key={organization.code}>
                {organization.name}
              </Option>
            )
          )}
      </Select>
    </DepartmentCur>
  )
}

const DepartmentCur = styled.div`
  height: 32px;
  margin: 16px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
`

export default observer(SideDepartmentList)
