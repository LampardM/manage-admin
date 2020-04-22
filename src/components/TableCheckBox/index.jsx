/**
 * @Desc checkbox融入版table
 * @exports class
 * @Author jieq
 * @Date 2020-04-21 21:05:16
 * @LastEditors jieq
 * @LastEditTime 2020-04-23 02:51:15
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
    let _cloneNodeData = deepCopy(cloneNodeData)

    console.log('columns', columns)
    console.log('cloneNodeData', _cloneNodeData)

    _cloneNodeData = recursiveSetting(_cloneNodeData)

    for (let i = 0; i < nodeToRow(_cloneNodeData); i++) {
      _cloneNodeData[i] = deepCopy(_cloneNodeData[0])
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

    console.log('formatData', formatData)
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
   * @param {Array<DataSourceItem>} data
   * @param {boolean} [forceChecked=false] 因为联动，强制设置勾选
   * @returns {Array<DataSourceItem>}
   */
  const recursiveSetting = (dataSource, forceChecked = false) => {
    if (dataSource.length) {
      dataSource.forEach(it => {
        if (it.subs) {
          if (it.checked) {
            return recursiveSetting(it.subs, true)
          } else {
            it.checked === undefined && (it.checked = forceChecked)
            return recursiveSetting(it.subs, forceChecked)
          }
        } else {
          it.checked === undefined && (it.checked = forceChecked)
        }
      })
      return dataSource
    } else {
      return dataSource
    }
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
    console.log('mergeCol:dataSource', dataSource)
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
    console.log('mergeCol', res)
    setMergeCol(res)
  }

  /**
   * @description 深拷贝
   * @param {T} data
   * @returns {T}
   */
  const deepCopy = data => {
    let dataTmp = undefined

    if (data === null || !(typeof data === 'object')) {
      dataTmp = data
    } else {
      dataTmp = data.constructor.name === 'Array' ? [] : {}

      for (let key in data) {
        dataTmp[key] = deepCopy(data[key])
      }
    }
    return dataTmp
  }

  /**
   * @description 递归于cloneNodeData里找到值为value的节点，将其checkbox状态更新
   * @param {Array<DataSourceItem>} nodeData 源data
   * @param {string} value
   * @param {boolean} newState
   * @return {void}
   */
  const queryNodeFromCloneNodeData = (nodeData, value, newState) => {
    if (nodeData.length) {
      nodeData.forEach(it => {
        if (it.key === value) {
          it.checked = newState
          return
        } else if (it.subs && it.subs.length) {
          return queryNodeFromCloneNodeData(it.subs, value, newState)
        }
      })

      setCloneNodeData(deepCopy(nodeData))
      // console.log('qiujie', nodeData);
    }
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
    queryNodeFromCloneNodeData(cloneNodeData, value, checked)
  }

  /**
   * @description 渲染每个td
   * @param {Array<string>} text
   * @param {object} record
   * @param {mumber} index
   * @returns {React.ReactElement}
   */
  const renderCheckboxItem = (text, record, index) => {
    console.log('checkboxItem', text)
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

  useEffect(() => {
    setCloneNodeData(nodeData) //同步传进来的nodeData的一份备份

    // const formatData = formatDataStructure()
    // setDataSource(formatData)

    // const mergeColArray = genMergeColArray(formatData)
    // setMergeCol(mergeColArray)
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
