/*
 * @Description: In User Settings Edit
 * @Author: jieq
 * @Date: 2020-04-16 22:33:39
 * @LastEditors: jieq
 * @LastEditTime: 2020-04-16 22:56:00
 */
import React from 'react'
import Loadable from 'react-loadable'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

class LoadingPage extends React.Component {
  //类似github页面加载的那个加载条
  componentWillMount() {
    NProgress.start()
  }

  componentWillUnmount() {
    NProgress.done()
  }

  render() {
    return <div />
  }
}

const LoadableComponent = component => {
  return Loadable({
    loader: component,
    loading: () => <LoadingPage />
  })
}

export default LoadableComponent
