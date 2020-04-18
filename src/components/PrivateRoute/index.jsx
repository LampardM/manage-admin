/*
 * @Description: 路由入口
 * @Author: longzhang6
 * @Date: 2020-04-11 16:02:24
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-18 13:11:45
 */
import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isAuthenticated } from '@/utils/session'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      !!isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location }
          }}
        />
      )
    }
  />
)

export default PrivateRoute
