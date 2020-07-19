/*
 * @Description: 编辑成员
 * @Author: longzhang6
 * @Date: 2020-04-20 22:13:49
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-07-19 15:16:25
 */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import AddEditMemberForm from './AddEditMemberForm'
import { useParams } from 'react-router-dom'

const EditMember = () => {
  const { memberCode } = useParams()

  return (
    <div style={{ padding: '0 16 16', marginTop: -16 }}>
      <EditMemberCon>
        <EditMemberTitle>编辑成员</EditMemberTitle>
        <EditMemberContent>
          <AddEditMemberForm memberCode={memberCode} />
        </EditMemberContent>
      </EditMemberCon>
    </div>
  )
}

const EditMemberCon = styled.div`
  width: 100%;
`

const EditMemberTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  padding: 0 16px 10px;
  background-color: #fff;
`

const EditMemberContent = styled.div`
  margin: 16px;
  padding: 16px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`

export default EditMember
