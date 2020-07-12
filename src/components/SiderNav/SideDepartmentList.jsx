/*
 * @Description: nav团队列表
 * @Author: longzhang6
 * @Date: 2020-05-13 22:13:14
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-07-12 18:44:06
 */
import React, { useState, useEffect } from 'react'
import { Select, message } from 'antd'
import { useSessionStorage } from 'react-use'
import { useStore } from '@/hooks/useStore'
import { switchDepartment } from '@/api/department'
import { useHistory } from 'react-router-dom'
import { setCurDepart, getCurDepart } from '@/utils/session'
import styled from 'styled-components'

const { Option } = Select

const SideDepartmentList = () => {
  const [userOrganizes] = useSessionStorage('user-organizes')
  const { userInfoStore } = useStore()
  const [curValue, setCurValue] = useState('')
  const history = useHistory()

  useEffect(() => {
    let _result
    if (userOrganizes) {
      _result = userOrganizes.find(depart => depart.code === getCurDepart())
      setCurValue(_result.name)
    }
  }, [])

  const getCurDepartName = () => {
    let _result
    if (userOrganizes) {
      _result = userOrganizes.find(depart => depart.code === getCurDepart())
      return _result.name
    } else {
      history.replace('/login')
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
        setCurDepart([option.key])
        setCurValue(value)
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
