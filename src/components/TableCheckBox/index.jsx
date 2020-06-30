/**
 * @Desc checkbox融入版table
 * @exports class
 * @Author jieq
 * @Date 2020-04-21 21:05:16
 * @LastEditors jieq
 * @LastEditTime 2020-05-10 02:17:53
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
 *
 *   @description emit给调用方
 *   @param {string} value 发生改变的checkbox的值
 *   @param {boolean} isChecked 勾选还是取消勾选
 *   @param {Array<string>} tailCollection 最后一列选中的勾选项的值的集合（即最下级子元素（最后一列）勾选项的值的集合）
 *   @param {Array<string>} allCollection 所有选中的勾选项的值的集合
 *   @param {Array<DataSourceItem, Array<DataSourceItem>>} nodeData 所有勾选项的值的集合
 *   initStructure?: (tailCollection: Array<string>, allCollection: Array<string>, nodeData: Array<DataSourceItem, Array<DataSourceItem>>) => any,
 *   onChange?: (value: string, isChecked: boolean, tailCollection: Array<string>, allCollection: Array<string>, nodeData: Array<DataSourceItem, Array<DataSourceItem>>) => any,
 *   showAllChecked?: boolean;
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
  initStructure = () => {},
  onChange = () => {},
  showAllChecked = false,
  ...restProps
}) => {
  const [mergeCol, setMergeCol] = useState({})
  const [dataSource, setDataSource] = useState([])
  const [cloneNodeData, setCloneNodeData] = useState([])
  const [isAllChecked, setIsAllChecked] = useState(false)
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
    let _cloneNodeData = []
    const [, cutOffRow] = nodeToRow(cloneNodeData)

    if (cutOffRow.length) {
      cutOffRow.forEach((it, idx) => {
        for (let i = 0; i < it; i++) {
          _cloneNodeData.push(cloneNodeData[idx])
        }
      })
    } else {
      _cloneNodeData = cloneNodeData
    }

    const formatData = nodePackageRow(_cloneNodeData, cutOffRow, [])

    setDataSource(formatData)
  }

  /**
   * @description 平铺的行组合成循环
   * @param {Array<DataSourceItem>} nodeData
   * @param {array} cutOffRow
   * @param {Array<DataSourceItem>} formatData
   * @returns {Array<DataSourceItem>} formatData
   */
  const nodePackageRow = (nodeData, cutOffRow, formatData) => {
    for (let i = 0; i < nodeData.length; i++) {
      formatData = packageRecursive(formatData, i, nodeData, cutOffRow)
    }
    return formatData
  }

  /**
   * @description 计算数组前n项和
   * @param {Array<number>} array
   * @param {number} num
   * @returns {number}
   */
  const getNumArrayTotal = (array, num) => {
    return array.reduce((pre, cur, index, arr) => {
      if (num <= 0) {
        return 0
      }
      if (index > num - 1) {
        return pre + 0
      }
      return pre + cur
    })
  }

  /**
   * @description 切分好的行组合成checkbox的cell
   * @param {Array<DataSourceItem>} formatData 目标数组
   * @param {number} nodeIdx 索引
   * @param {Array<DataSourceItem>} nodeData 源素组
   * @param {Array<number>} cutOffRow 源分组数组recursiveQuery
   * @returns {Array<DataSourceItem>} formatData
   */
  const packageRecursive = (formatData, nodeIdx, nodeData, cutOffRow) => {
    const cardinal = formatData.length
    const accItem = (formatData[cardinal] = {})
    columns.forEach((column, cIdx) => {
      accItem[column.dataIndex] = []

      let cutOffRowItem = 0
      if (cutOffRow.length) {
        for (let idx = 0; idx < cutOffRow.length; idx++) {
          if (nodeIdx < getNumArrayTotal(cutOffRow, idx + 1)) {
            cutOffRowItem = nodeIdx
            break
          } else if (
            getNumArrayTotal(cutOffRow, idx + 1) <= nodeIdx &&
            nodeIdx < getNumArrayTotal(cutOffRow, idx + 2)
          ) {
            cutOffRowItem = nodeIdx - getNumArrayTotal(cutOffRow, idx + 1)
            break
          } /*  else if(getNumArrayTotal(cutOffRow, idx + 2) <= nodeIdx && nodeIdx < getNumArrayTotal(cutOffRow, idx + 3)) {
          cutOffRowItem = nodeIdx - getNumArrayTotal(cutOffRow, idx + 2)
          break
        } */
        }
      }

      const recursiveQueryRes = recursiveQuery(nodeData, nodeIdx, cIdx, cutOffRowItem)
      console.log('recursiveQueryRes', recursiveQueryRes)
      if (Ext.isArray(recursiveQueryRes)) {
        recursiveQueryRes.forEach((it, idx) => {
          accItem[column.dataIndex][idx] = `${it.key}###${it.value}###${it.checked}`
        })
      } else {
        accItem[
          column.dataIndex
        ][0] = `${recursiveQueryRes.key}###${recursiveQueryRes.value}###${recursiveQueryRes.checked}`
      }
      console.log('1- - - - - - - - - - - - - - - - - - - -')
      console.log('\n')
    })
    return formatData
  }

  /**
   * @description 递归取多维数组中某层的值array
   * @param {Array<DataSourceItem> | DataSourceItem} DataSourceItemOrArray 源数组
   * @param {number} arrIdx arr数组的第几项
   * @param {number} layerIdx 递归层数
   * @returns {Array<DataSourceItem> | DataSourceItem}
   */
  const recursiveQuery = (DataSourceItemOrArray, arrIdx, layerIdx, reckon) => {
    let DataSourceItemArray
    if (Ext.isArray(DataSourceItemOrArray)) {
      DataSourceItemArray = DataSourceItemOrArray
    } else {
      DataSourceItemArray = DataSourceItemOrArray.subs
    }
    if (layerIdx === 0) {
      return DataSourceItemArray[arrIdx] &&
        DataSourceItemArray[arrIdx].subs &&
        DataSourceItemArray[arrIdx].subs.length
        ? DataSourceItemArray[arrIdx]
        : DataSourceItemArray
    } else {
      let cutOffArrIdx = arrIdx
      return recursiveQuery(DataSourceItemArray[arrIdx].subs, reckon, --layerIdx, reckon)
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
  const nodeToRow = (nodeData, rowlen, cutOffRow) => {
    const cutOff = nodeData.every(
      nd => !nd.subs || !nd.subs.length || nd.subs.every(it => !it.subs || !it.subs.length)
    )

    if (rowlen === undefined) {
      // 第一次进来
      rowlen = 0
      cutOffRow = []
      if (cutOff) return [rowlen, cutOffRow]
    }

    if (cutOff) {
      rowlen = nodeData.length
      cutOffRow.push(rowlen)
    } else {
      for (let i = 0; i < nodeData.length; i++) {
        if (nodeData[i].subs && nodeData[i].subs.length) {
          const res = nodeToRow(nodeData[i].subs, rowlen, cutOffRow)
          rowlen = res[0]
          cutOffRow = res[1]
        } else {
          continue
        }
      }
    }
    return [rowlen, cutOffRow]
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

    const newCloneNodeData = cloneDeep(parentNode || nodeData)

    if (showAllChecked) {
      const allCheckedStatus = checkAllChecked(newCloneNodeData)
      setIsAllChecked(allCheckedStatus)
    }

    setCloneNodeData(newCloneNodeData)

    console.log('getTailCheckedCollection', getTailCheckedCollection(newCloneNodeData, []))
    console.log('getAllCheckedCollection', getAllCheckedCollection(newCloneNodeData, []))
    onChange(
      value,
      checked,
      getTailCheckedCollection(newCloneNodeData, []),
      getAllCheckedCollection(newCloneNodeData, []),
      newCloneNodeData
    )
  }

  /**
   * @description 获取最后一列选中的勾选项的值的集合（即最下级子元素（最后一列）勾选项的值的集合）
   * @param {Array<DataSourceItem>} nodeData 最新的cloneNodeData
   * @param {Array<any>} result 接收结果的容器
   * @returns {Array<string>}
   */
  const getTailCheckedCollection = (nodeData, result) => {
    nodeData.forEach(it => {
      if (it.subs && it.subs.length) {
        result = getTailCheckedCollection(it.subs, result)
      } else {
        if (it.checked) {
          result.push(it.key /* it.value */)
        }
      }
    })
    return result
  }

  /**
   * @description 获取所有选中的勾选项的值的集合
   * @param {Array<DataSourceItem>} nodeData 最新的cloneNodeData
   * @param {Array<any>} result 接收结果的容器
   * @returns {Array<string>}
   */
  const getAllCheckedCollection = (nodeData, result) => {
    nodeData.forEach(it => {
      if (it.checked) {
        result.push(it.key /* it.value */)
      }
      if (it.subs) {
        result = getAllCheckedCollection(it.subs, result)
      }
    })
    return result
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
   * @param {object} opt
   * @param {DataSourceItem} opt.parentNode
   * @param {Array<DataSourceItem>} opt.nodeData
   */
  const recursiveQueryCheckedFromInital = ({ parentNode, nodeData }) => {
    nodeData.forEach(it => {
      if (it.checked) {
        if (it.subs) {
          if (it.subs.length) {
            it.subs = recursiveSetting(it.subs, true, it.checked)
          } else {
            delete it.subs
          }
        }
      } else {
        if (it.subs) {
          if (it.subs.length) {
            recursiveQueryCheckedFromInital({ parentNode: it, nodeData: it.subs })
          } else {
            delete it.subs
          }
        }
      }
      if (it.parent) {
        parentNode = recursiveParentSetting(parentNode, nodeData, !!it.checked)
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

  /**
   * @description 遍历树结构，设置所有为勾选或者不勾选
   * @param {Array<DataSourceItem>} nodeData
   * @returns {Array<DataSourceItem>} cloneNodeData
   */
  const traverseSetChecked = (isChecked, nodeData) => {
    if (nodeData.length) {
      nodeData.forEach(it => {
        it.checked = isChecked

        if (it.subs) {
          it.subs = traverseSetChecked(isChecked, it.subs)
        }
      })
    }
    return nodeData
  }

  /**
   * @description 某个checkbox状态改变，反查'全部'是否勾选或未勾选
   * @param {boolean} [status=true] 所有是否勾选状态
   * @returns {void}
   */
  const checkAllChecked = (nodeData, status = true) => {
    if (nodeData.length) {
      for (let i = 0; i < nodeData.length; i++) {
        const it = nodeData[i]
        if (!it.checked) {
          status = false
          return status
        }
        if (it.subs) {
          status = checkAllChecked(it.subs, status)
        }
      }
      return true
    } else {
      return false
    }
  }

  const onAllChange = ({ target }) => {
    console.log('onAllChange', target.checked)
    setIsAllChecked(target.checked)

    const cloneNodeDataAfterSetAll = traverseSetChecked(target.checked, cloneNodeData)
    setCloneNodeData(cloneDeep(cloneNodeDataAfterSetAll))

    console.log('getTailCheckedCollection', getTailCheckedCollection(cloneNodeDataAfterSetAll, []))
    console.log('getAllCheckedCollection', getAllCheckedCollection(cloneNodeDataAfterSetAll, []))
    onChange(
      'ALL',
      target.checked,
      getTailCheckedCollection(cloneNodeDataAfterSetAll, []),
      getAllCheckedCollection(cloneNodeDataAfterSetAll, []),
      cloneNodeDataAfterSetAll
    )
  }

  useEffect(() => {
    const cloneNodeData = cloneDeep(nodeData)

    const cloneNodeDataAftertraverse = traverseNodeData({
      parentNode: null,
      nodeData: cloneNodeData
    })
    recursiveQueryCheckedFromInital({ parentNode: null, nodeData: cloneNodeDataAftertraverse })
    setCloneNodeData(cloneNodeData)
    initStructure(
      getTailCheckedCollection(cloneNodeData, []),
      getAllCheckedCollection(cloneNodeData, []),
      cloneNodeData
    )
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

  return (
    <>
      {showAllChecked ? (
        <Checkbox checked={isAllChecked} onChange={onAllChange}>
          全选
        </Checkbox>
      ) : null}
      <Table
        {...restProps}
        columns={formatColumns}
        dataSource={dataSource}
        rowKey={row => {
          return row[columns[columns.length - 1].dataIndex].join('-')
        }}
      />
    </>
  )
}

export default TableCheckBox
