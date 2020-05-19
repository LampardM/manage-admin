/*
 * @Description: nav团队列表
 * @Author: longzhang6
 * @Date: 2020-05-13 22:13:14
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-05-16 14:21:56
 */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useStore } from '@/hooks/useStore'
import { useSessionStorage } from 'react-use'

const SideDepartmentList = () => {
  const { userInfoStore } = useStore()
  const [userOrganizes] = useSessionStorage('user-organizes')

  return (
    <>
      {userInfoStore.organizes.map((organization, idx) => (
        <orgItem key={idx}>{organization}</orgItem>
      ))}
    </>
  )
}

const orgItem = styled.div`
  font-size: 22px;
  padding-left: 24px;
  color: #fff;
  height: 40px;
  line-height: 40px;
`

export default SideDepartmentList
