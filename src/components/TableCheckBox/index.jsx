/**
 * @Desc checkbox融入版table
 * @exports class
 * @Author jieq
 * @Date 2020-04-21 21:05:16
 * @LastEditors jieq
 * @LastEditTime 2020-04-24 02:02:12
 * 
 * ```
 * interface ColumnsItem {
 *   title: string; //表头项显示内容
 *   dataIndex: string; //表头项索引key
 * }
 * 
 * interface DataSourceItem {
 *   key: string; //checkbox的value
 *   value: string; //checkbox显示内容
 *   checked?: boolean; //checkbox初始化是否勾选
 *   subs?: Array<DataSourceItem>; //子DataSource
 * }

 * interface TableCheckBoxProps {
 *   columns?: Array<ColumnsItem>;
 *   nodeData?: Array<DataSourceItem>;
 *   [restProps: string]?: any;
 * }
 * ```
 * 
 */

/** official */
// import styled from 'styled-components'
import { cloneDeep } from 'lodash'
import React, { useState, useEffect, useMemo, useCallback } from 'react'

/** vendor */
import { Table, Checkbox } from 'antd'

/** custom */
import { Ext } from '../../utils'

const TableCheckBox /**: TableCheckBoxProps */ = ({
  columns = [],
  nodeData = [],
  ...restProps
}) => {
  const [mergeCol, setMergeCol] = useState({})
  const [dataSource, setDataSource] = useState([])
  const [cloneNodeData, setCloneNodeData] = useState([])
  const [formatColumns, setFormatColumns] = useState(columns)

  /**
   * @description 格式化表头
   * @param {Array<ColumnsItem>} columns
   * @return {void}
   */
  const formatColumnsStructure = () => {
    const formatColumns = columns.map(it => ({
      ...it,
      render: (text, record, rowIndex) => {
        const res = {
          props: {
            rowSpan: mergeCol[it.dataIndex][rowIndex]
          },
          children: renderCheckboxItem(text, record, rowIndex)
        }

        return res
      }
    }))
    setFormatColumns(formatColumns)
  }

  const formatDataStructure = () => {
    let _cloneNodeData = cloneDeep(cloneNodeData)

    for (let i = 0; i < nodeToRow(_cloneNodeData); i++) {
      _cloneNodeData[i] = cloneDeep(_cloneNodeData[0])
    }

    const formatData = _cloneNodeData.reduce((acc, cur, nodeIdx) => {
      acc[nodeIdx] = {}
      const accItem = acc[nodeIdx]
      for (let colIdx = 0; colIdx < columns.length; colIdx++) {
        const dataProp = columns[colIdx].dataIndex
        const res = recursiveQuery(_cloneNodeData, nodeIdx, colIdx)
        accItem[dataProp] = []
        if (Ext.isArray(res)) {
          res.forEach((it, idx) => {
            accItem[dataProp][idx] = `${it.key}###${it.value}###${it.checked}`
          })
        } else {
          accItem[dataProp][0] = `${res.key}###${res.value}###${res.checked}`
        }
      }

      return acc
    }, [])

    setDataSource(formatData)

    //表头依赖于内容数据结构
    // formatColumnsStructure(columns)
  }

  /**
   * @description 递归取多维数组中某层的值array
   * @param {Array<DataSourceItem>} arr 源数组
   * @param {number} arrIdx arr数组的第几项
   * @param {number} layerIdx 递归层数
   * @returns {Array<DataSourceItem> | DataSourceItem}
   */
  const recursiveQuery = (arr, arrIdx, layerIdx) => {
    if (layerIdx === 0) {
      return arr[arrIdx].subs ? arr[arrIdx] : arr
    } else {
      return recursiveQuery(arr[arrIdx].subs, arrIdx, --layerIdx)
    }
  }

  /**
   * @description 如果当前DataSourceItem的checked为true(勾选)，则他的子元素（subs）下面的每一个则需要勾选
   * @brief 递归设置联动
   * @param {Array<DataSourceItem>} dataSource
   * @param {boolean} [forceFollowParent=false] 是否强制跟随父节点
   * @param {boolean} parentState 若forceFollowParent为true，父节点的勾选状态
   * @returns {Array<DataSourceItem>}
   */
  const recursiveSetting = (dataSource, forceFollowParent = false, parentState) => {
    if (dataSource.length) {
      dataSource.forEach(it => {
        if (forceFollowParent) {
          it.checked = parentState
          if (it.subs) {
            it.subs = recursiveSetting(it.subs, forceFollowParent, parentState)
          }
        }
      })
      return dataSource
    } else {
      return dataSource
    }
  }

  /**
   * @description 递归父节点设置
   * @param {DataSourceItem} parentNodeData
   * @param {Array<DataSourceItem>} childNodeData
   * @param {boolean} childState
   */
  const recursiveParentSetting = (parentNodeData, childNodeData, childState) => {
    if (childState) {
      if (childNodeData.every(it => it.checked === childState)) {
        //兄弟节点一致父节点勾选
        parentNodeData.checked = childState
      }
    } else {
      //兄弟节点不一致取消父节点勾选
      parentNodeData.checked = childState
    }
    if (parentNodeData.parent) {
      return recursiveParentSetting(parentNodeData.parent, parentNodeData.parent.subs, childState)
    }
    return parentNodeData
  }

  /**
   * @description 递归查询当前索引为0的值是否有subs，如果没有，则将这层的length作为row的行数
   * @brief node结构递归
   * @param {Array<DataSourceItem>} data
   * @return {number}
   */
  const nodeToRow = nodeData => {
    if (nodeData.length) {
      if (nodeData[0].subs && !nodeData[0].subs[0].subs) {
        return nodeData.length
      } else {
        return nodeToRow(nodeData[0].subs)
      }
    } else {
      return 0
    }
  }

  /**
   * @description 某一列的哪几行要合并
   * @param {DataSourceItem} dataSource
   * @returns {void}
   */
  const genMergeColArray = dataSource => {
    let tmp = {}
    const res = {}
    columns.forEach(({ dataIndex = '' }) => {
      let initalNotExist = 0

      tmp = {}
      res[dataIndex] = []

      dataSource.forEach((it, idx) => {
        const existKey = it[dataIndex].join('@@@')
        let existValue = tmp[existKey] || 0

        if (existValue) {
          ++existValue
          res[dataIndex][idx] = 0
          res[dataIndex][initalNotExist] = existValue
        } else {
          res[dataIndex][idx] = 1
          initalNotExist = idx
          ++existValue
        }

        tmp[existKey] = existValue
      })
    })
    setMergeCol(res)
  }

  /**
   * @description 递归于cloneNodeData里找到值为value的节点，将其checkbox状态更新
   * @brief 联动设置
   * @param {object} argv 参数
   * @param {DataSourceItem} argv.parentNode 父节点
   * @param {Array<DataSourceItem>} argv.nodeData 源data
   * @param {string} argv.value
   * @param {boolean} argv.newState
   * @param {boolean} argv.newState
   * @return {Array<DataSourceItem, Array<DataSourceItem>>}
   */
  const setNodeAndLinkageState = ({ parentNode, nodeData, value, newState }) => {
    if (nodeData.length) {
      for (let i = 0; i < nodeData.length; i++) {
        let it = nodeData[i]

        // if (parentNode) {
        //   const { key, value, checked, parent } = parentNode
        //   it.parent = parentNode /* {
        //     key,
        //     value,
        //     parent,
        //     checked
        //   } */
        // }

        if (it.key === value) {
          //当前设置
          it.checked = newState

          //下级设置
          if (it.subs) {
            const nodeDataAfterSetChild = recursiveSetting(it.subs, true, newState)
            it.subs = nodeDataAfterSetChild
          }

          //上级级设置
          if (it.parent) {
            parentNode = recursiveParentSetting(parentNode, nodeData, newState)
          }
        } else if (it.subs) {
          //当前未找到，去下级继续查找
          const res = setNodeAndLinkageState({
            value,
            newState,
            parentNode: it,
            nodeData: it.subs
          })

          it = res[0]
          it.subs = res[1]
        }
      }
    }
    return [parentNode, nodeData]
  }

  /**
   * @description checkbox状态改变
   * @param {T} evt
   * @param {U} evt.target
   * @returns {void}
   */
  const onCheckboxChange = ({ target }) => {
    const { value, checked } = target
    console.log('checkedList', value, checked)
    const [parentNode, nodeData] = setNodeAndLinkageState({
      value,
      parentNode: null,
      newState: checked,
      nodeData: cloneNodeData
    })

    setCloneNodeData(cloneDeep(parentNode || nodeData))
  }

  /**
   * @description 渲染每个td
   * @param {Array<string>} text
   * @param {object} record
   * @param {mumber} index
   * @returns {React.ReactElement}
   */
  const renderCheckboxItem = (text, record, index) => {
    return (
      <>
        {text.map(it => {
          const [value, label, checked] = it.split('###')
          return (
            <Checkbox
              key={value}
              value={value}
              checked={checked === 'true'}
              onChange={onCheckboxChange}
            >
              {label}
            </Checkbox>
          )
        })}
      </>
    )
  }

  /**
   * @description 递归查找默认勾选的项
   * @param {Array<DataSourceItem>} nodeData
   */
  const recursiveQueryCheckedFromInital = ({ parentNode, nodeData }) => {
    nodeData.forEach(it => {
      if (it.checked) {
        if (it.subs) {
          it.subs = recursiveSetting(it.subs, true, it.checked)
        }
        if (it.parent) {
          parentNode = recursiveParentSetting(parentNode, nodeData, !!it.checked)
        }
      } else {
        if (it.subs) {
          recursiveQueryCheckedFromInital({ parentNode: it, nodeData: it.subs })
        }
      }
    })
  }

  /**
   * @description 初始化遍历树结构，让其索引父节点
   * @param {object} argv{ parentNode, nodeData }
   * @param {DataSourceItem} argv.parentNode
   * @param {Array<DataSourceItem>} argv.nodeData
   * @returns {Array<DataSourceItem>}
   */
  const traverseNodeData = ({ parentNode, nodeData }) => {
    if (nodeData.length) {
      nodeData.forEach(it => {
        if (parentNode) {
          it.parent = parentNode
        }
        if (it.subs) {
          it.subs = traverseNodeData({ parentNode: it, nodeData: it.subs })
        }
      })
    }
    return nodeData
  }

  useEffect(() => {
    const cloneNodeData = cloneDeep(nodeData)

    const cloneNodeDataAftertraverse = traverseNodeData({
      parentNode: null,
      nodeData: cloneNodeData
    })
    recursiveQueryCheckedFromInital({ parentNode: null, nodeData: cloneNodeDataAftertraverse })
    setCloneNodeData(cloneNodeData)
  }, [nodeData])

  useEffect(() => {
    formatDataStructure()
  }, [cloneNodeData])

  useEffect(() => {
    genMergeColArray(dataSource)
  }, [dataSource])

  useEffect(() => {
    formatColumnsStructure()
  }, [mergeCol])

  return <Table columns={formatColumns} dataSource={dataSource} {...restProps} />
}

export default TableCheckBox
