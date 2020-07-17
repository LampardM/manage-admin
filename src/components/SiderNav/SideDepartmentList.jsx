/*
 * @Description: nav团队列表
 * @Author: longzhang6
 * @Date: 2020-05-13 22:13:14
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-07-17 23:06:24
 */
import React, { useState, useEffect } from 'react'
import { Select, message } from 'antd'
import { useStore } from '@/hooks/useStore'
import { useLocalStorageState } from '@umijs/hooks'
import { switchDepartment } from '@/api/department'
import { useHistory } from 'react-router-dom'
import { setNickName, setCurDepart, getCurDepart } from '@/utils/session'
import styled from 'styled-components'

const { Option } = Select

const SideDepartmentList = props => {
  const [userOrganizes] = useLocalStorageState('user-organizes')
  const [userMenus, setUserMenus] = useLocalStorageState('user-menus')
  const { userInfoStore } = useStore()
  const [curValue, setCurValue] = useState('')
  const history = useHistory()

  useEffect(() => {
    let _result
    if (userOrganizes && userOrganizes.length) {
      _result = userOrganizes.find(depart => depart.code === getCurDepart())
      setCurValue(_result.name)
    } else {
      setCurValue('暂无团队')
    }
  }, [])

  const getCurDepartName = () => {
    let _result
    if (userOrganizes && userOrganizes.length) {
      _result = userOrganizes.find(depart => depart.code === getCurDepart())
      return _result.name
    } else {
      return '暂无团队'
    }
  }

  const handleChange = (value, option) => {
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
          userOrganizes.map((organization, idx) => (
            <Option value={organization.name} key={organization.code}>
              {organization.name}
            </Option>
          ))}
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

export default SideDepartmentList
