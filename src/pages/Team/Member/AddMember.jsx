/*
 * @Description: 添加成员
 * @Author: longzhang6
 * @Date: 2020-04-19 22:29:22
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-20 22:05:06
 */
import React, { useState, useEffect } from 'react'
import { Button, Form, Input, Cascader } from 'antd'
import styled from 'styled-components'

const AddMember = () => {
  return (
    <div style={{ padding: '0 16 16', marginTop: -16 }}>
      <AddMemberCon>
        <AddMemberTitle>添加成员</AddMemberTitle>
        <AddMemberContent></AddMemberContent>
      </AddMemberCon>
    </div>
  )
}

const AddMemberCon = styled.div`
  width: 100%;
`

const AddMemberTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  padding: 0 16px 10px;
  background-color: #fff;
`

const AddMemberContent = styled.div`
  margin: 16px;
  padding: 16px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`

export default AddMember
