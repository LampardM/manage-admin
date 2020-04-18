/*
 * @Description: 组织架构内容
 * @Author: longzhang6
 * @Date: 2020-04-18 15:46:55
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-18 22:47:00
 */
import React, { useState, useEffect } from 'react'
import { Button, Tree } from 'antd'
import { observer } from 'mobx-react'
import styled from 'styled-components'

const treeData = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          {
            title: '0-0-0-0',
            key: '0-0-0-0'
          },
          {
            title: '0-0-0-1',
            key: '0-0-0-1'
          },
          {
            title: '0-0-0-2',
            key: '0-0-0-2'
          }
        ]
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          {
            title: '0-0-1-0',
            key: '0-0-1-0'
          },
          {
            title: '0-0-1-1',
            key: '0-0-1-1'
          },
          {
            title: '0-0-1-2',
            key: '0-0-1-2'
          }
        ]
      },
      {
        title: '0-0-2',
        key: '0-0-2'
      }
    ]
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      {
        title: '0-1-0-0',
        key: '0-1-0-0'
      },
      {
        title: '0-1-0-1',
        key: '0-1-0-1'
      },
      {
        title: '0-1-0-2',
        key: '0-1-0-2'
      }
    ]
  },
  {
    title: '0-2',
    key: '0-2'
  }
]

const ArchitectureContent = () => {
  const [expandedKeys, setExpandedKeys] = useState([])
  // const [checkedKeys, setCheckedKeys] = useState(['0-0-0'])
  // const [selectedKeys, setSelectedKeys] = useState([])
  const [autoExpandParent, setAutoExpandParent] = useState(true)
  const [defaultAllExpand, setDefaultAllExpand] = useState(false)
  const [recursionResult, setRecursionResult] = useState([])

  const onExpand = (expandedKeys, info) => {
    console.log('onExpand', expandedKeys)
    console.log(info, 'info')

    setExpandedKeys(expandedKeys)
    setAutoExpandParent(false)
  }

  const onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys)
    // setCheckedKeys(checkedKeys)
  }

  const onSelect = (selectedKeys, info) => {
    console.log('onSelect', info)
    // setSelectedKeys(selectedKeys)
  }

  const recursionExpandKeys = (arr, result) => {
    arr.forEach(element => {
      let exitIdx = result.findIndex(key => key === element.key)
      if (exitIdx === -1) {
        result.push(element.key)
      }

      if (element.children) {
        recursionExpandKeys(element.children, result)
      }
    })
    return result
  }

  useEffect(() => {
    setRecursionResult(treeData)
  })

  const openOrCloseAllNode = () => {
    setDefaultAllExpand(!defaultAllExpand)

    if (defaultAllExpand === true) {
      setExpandedKeys([])
    } else {
      setExpandedKeys(recursionExpandKeys(treeData, []))
    }
    setAutoExpandParent(false)
  }

  return (
    <ArchitectureContainer>
      <ArchitectureTitle>
        <OpenAll onClick={openOrCloseAllNode}>{defaultAllExpand ? '全部收起' : '全部展开'}</OpenAll>
        <Button type="primary">添加部门</Button>
      </ArchitectureTitle>
      <ArchitectureMain>
        <Tree
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          defaultExpandAll={defaultAllExpand}
          autoExpandParent={autoExpandParent}
          selectable={false}
          onCheck={onCheck}
          onSelect={onSelect}
          treeData={recursionResult}
        />
      </ArchitectureMain>
    </ArchitectureContainer>
  )
}

const ArchitectureContainer = styled.div`
  margin: 16px;
  background: #fff;
`

const ArchitectureTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
`

const OpenAll = styled.span`
  cursor: pointer;
`

const ArchitectureMain = styled.div`
  padding: 10px;
`

export default observer(ArchitectureContent)
