/**
 * @Desc checkbox融入版table
 * @exports class
 * @Author jieq
 * @Date 2020-04-21 21:05:16
 * @LastEditors jieq
 * @LastEditTime 2020-04-22 03:05:44
 */

/** official */
// import styled from 'styled-components'
import React, { useState, useEffect, useMemo /* useCallback */ } from 'react'

/** vendor */
import { Table, Checkbox } from 'antd'

/** custom */
import { Ext } from '../../utils'

interface ColumnsItem {
  title: string; //表头项显示内容
  dataIndex: string; //表头项索引key
}

interface DataSourceItem {
  key: string; //checkbox的value
  value: string; //checkbox显示内容
  checked?: boolean; //checkbox初始化是否勾选
  subs?: Array<DataSourceItem>; //子DataSource
}

interface TableCheckBoxProps {
  columns?: Array<ColumnsItem>;
  nodeData?: Array<DataSourceItem>;
}

const TableCheckBox: TableCheckBoxProps = ({ columns = [], nodeData = [], ...restProps }) => {
  const [mergeCol, setMergeCol] = useState({})
  const [dataSource, setDataSource] = useState([])
  const [formatColumns, setFormatColumns] = useState(columns)

  /**
   * @description 格式化表头
   * @param {ColumnsItem} columns
   * @return {void}
   */
  const formatColumnsStructure: (Array<ColumnsItem>) => void = columns => {
    const formatColumns = columns.map(it => ({
      ...it,
      render: (text: array, record, rowIndex) => {
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

  const formatDataStructure = useMemo(() => {
    return () => {
      let cloneNodeData = deepCopy(nodeData)

      console.log('columns', columns)
      console.log('cloneNodeData', cloneNodeData)

      cloneNodeData = recursiveSetting(cloneNodeData)

      for (let i = 0; i < nodeToRow(cloneNodeData); i++) {
        cloneNodeData[i] = deepCopy(cloneNodeData[0])
      }

      const formatData = cloneNodeData.reduce((acc, cur, nodeIdx) => {
        acc[nodeIdx] = {}
        const accItem = acc[nodeIdx]
        for (let colIdx = 0; colIdx < columns.length; colIdx++) {
          const dataProp = columns[colIdx].dataIndex
          const res = recursiveQuery(cloneNodeData, nodeIdx, colIdx)
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
      //   const formatData = cloneNodeData

      console.log('formatData', formatData)
      setDataSource(formatData)
      genMergeColArray(formatData)

      //表头依赖于内容数据结构
      formatColumnsStructure(columns)
    }
  }, [columns, nodeData])

  /**
   * @description 递归取多维数组中某层的值array
   * @param {Array} arr 源数组
   * @param {Number} arrIdx arr数组的第几项
   * @param {Number} layerIdx 递归层数
   */
  const recursiveQuery: (
    Array<DataSourceItem>,
    number,
    number
  ) => Array<DataSourceItem> | DataSourceItem = (arr, arrIdx, layerIdx) => {
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
   */
  const recursiveSetting: (Array<DataSourceItem>) => Array<DataSourceItem> = (
    dataSource,
    forceChecked = false
  ) => {
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
   */
  const nodeToRow: (Array<DataSourceItem>) => number = nodeData => {
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
  const genMergeColArray: DataSourceItem => void = dataSource => {
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
  const deepCopy: <T>(data: T) => T = data => {
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

  const onCheckboxChange = checkedList => {
    console.log('checkedList', checkedList)
  }

  const renderCheckboxItem = (text: array, record, index) => {
    console.log('checkboxItem', text)
    return (
      <>
        {text.map(it => {
          const [value, label, checked] = it.split('###')
          return (
            <Checkbox value={value} checked={checked === 'true'} onChange={onCheckboxChange}>
              {label}
            </Checkbox>
          )
        })}
      </>
    )
  }

  useEffect(() => {
    formatDataStructure()
  }, [columns, nodeData, formatDataStructure])

  return <Table columns={formatColumns} dataSource={dataSource} {...restProps} />
}

export default TableCheckBox
