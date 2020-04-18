/*
 * @Description: 组织架构内容
 * @Author: longzhang6
 * @Date: 2020-04-18 15:46:55
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-18 17:18:14
 */
import React, { useState, useEffect } from 'react'
import { Form, Input, Select, Button, Steps, message } from 'antd'
import { observer } from 'mobx-react'
import styled from 'styled-components'

const ArchitectureContent = () => {
  return (
    <ArchitectureContainer>
      <ArchitectureTitle>
        <span>全部展开</span>
        <span>添加部门</span>
      </ArchitectureTitle>
    </ArchitectureContainer>
  )
}

const ArchitectureContainer = styled.div`
  margin: 16px;
  background: #fff;
`

const ArchitectureTitle = styled.div``

export default observer(ArchitectureContent)
