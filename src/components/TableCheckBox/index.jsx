/**
 * @Desc checkbox融入版table
 * @exports class
 * @Author jieq
 * @Date 2020-04-21 21:05:16
 * @LastEditors jieq
 * @LastEditTime 2020-04-22 00:28:06
 * ```
 * TableCheckBox.propTypes = {
 *  columns: PropTypes.instanceOf(Columns),
 *  nodeData: PropTypes.instanceOf(Array<DataSource>),
 * }
 * ```
 */

/** official */
// import styled from 'styled-components'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useMemo, useCallback } from 'react'

/** vendor */
import { Table, Checkbox } from 'antd'

/** custom */
import { Ext } from '../../utils'

interface Columns {
  title: string; //表头项显示内容
  dataIndex: string; //表头项索引key
}

interface DataSource {
  key: string; //checkbox的value
  value: string; //checkbox显示内容
  subs: Array<DataSource>; //子DataSource
}

const TableCheckBox = ({ columns, nodeData, ...restProps }) => {
  const [dataSource, setDataSource] = useState([])
  const [formatColumns, setFormatColumns] = useState(columns)

  /**
   * @description 格式化表头
   * @param {Columns} columns
   * @return {void}
   */
  const formatColumnsStructure: Columns => void = columns => {
    const formatColumns = columns.map(it => ({
      ...it,
      render: (text: array, record, index) => {
        console.log('render:', text, record, index)
        mergeCol(dataSource)
        return {
          props: {},
          children: renderCheckboxItem(text, record, index)
        }
      }
    }))
    setFormatColumns(formatColumns)
  }

  const formatDataStructure = useMemo(() => {
    return () => {
      const cloneNodeData = deepCopy(nodeData)

      console.log('columns', columns)
      console.log('cloneNodeData', cloneNodeData)

      for (let i = 0; i < nodeToRow(cloneNodeData); i++) {
        cloneNodeData[i] = deepCopy(cloneNodeData[0])
      }

      const formatData = cloneNodeData.reduce((acc, cur, nodeIdx) => {
        acc[nodeIdx] = {}
        const accItem = acc[nodeIdx]
        for (let colIdx = 0; colIdx < columns.length; colIdx++) {
          const dataProp = columns[colIdx].dataIndex
          const res = recursive(cloneNodeData, nodeIdx, colIdx)
          accItem[dataProp] = []
          if (Ext.isArray(res)) {
            res.forEach((it, idx) => {
              accItem[dataProp][idx] = `${it.key}###${it.value}`
            })
          } else {
            accItem[dataProp][0] = `${res.key}###${res.value}`
          }
        }

        return acc
      }, [])
      //   const formatData = cloneNodeData

      console.log('formatData', formatData)
      setDataSource(formatData)

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
  const recursive: (Array, Number, Number) => DataSource[] | DataSource = (
    arr,
    arrIdx,
    layerIdx
  ) => {
    if (layerIdx === 0) {
      return arr[arrIdx].subs ? arr[arrIdx] : arr
    } else {
      return recursive(arr[arrIdx].subs, arrIdx, --layerIdx)
    }
  }

  /**
   * @description 查询当前索引为0的值是否有subs，如果没有，则将这层的length作为row的行数
   * @brief node结构递归
   * @param {Array<DataSource>} data
   */
  const nodeToRow: (DataSource[]) => Number = nodeData => {
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
   * @param {DataSource} dataSource
   * @returns {Array}
   */
  const mergeCol: DataSource => Array = dataSource => {
    console.log('mergeCol:dataSource', dataSource)
    const res = []
    columns.forEach(({ dataIndex = '' }) => {})

    return res
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
    return (
      <>
        {text.map(it => {
          const [value, label] = it.split('###')
          return (
            <Checkbox value={value} onChange={onCheckboxChange}>
              {label}
            </Checkbox>
          )
        })}
      </>
    )
  }

  useEffect(() => {
    formatDataStructure()
  }, [columns, nodeData])

  return <Table columns={formatColumns} dataSource={dataSource} {...restProps} />
}

TableCheckBox.propTypes = {
  columns: PropTypes.instanceOf(Columns),
  nodeData: PropTypes.arrayOf(DataSource)
}

export default TableCheckBox
