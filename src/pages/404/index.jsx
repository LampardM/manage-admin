/*
 * @Description: 404
 * @Author: longzhang6
 * @Date: 2020-05-06 21:35:33
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-05-06 21:39:29
 */
import React from 'react'
import { Result, Button } from 'antd'
import { useHistory } from 'react-router-dom'

const NotFound = () => {
  const history = useHistory()

  const backHome = () => {
    history.push('/home')
  }

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited doesn't exist"
      extra={
        <Button onClick={backHome} type="primary">
          回到首页
        </Button>
      }
    />
  )
}

export default NotFound
