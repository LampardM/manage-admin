/*
 * @Description: 自定义的面包屑
 * @Author: jieq
 * @Date: 2020-04-16 22:47:14
 * @LastEditors: jieq
 * @LastEditTime: 2020-04-17 01:02:35
 */
import React from 'react'
import { Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'

const _Breadcrumb = props => (
  <Breadcrumb style={{ marginBottom: 16 }}>
    {/* <Breadcrumb.Item>
          <Link to="/home">首页</Link>
        </Breadcrumb.Item> */}
    {props.arr &&
      props.arr.map(item => {
        if (typeof item === 'object') {
          return (
            <Breadcrumb.Item key={item.title}>
              <Link to={item.to}>{item.title}</Link>
            </Breadcrumb.Item>
          )
        } else {
          return <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>
        }
      })}
  </Breadcrumb>
)

export default _Breadcrumb
