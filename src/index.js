/*
 * @Description: 程序入口文件
 * @Author: longzhang6
 * @Date: 2020-04-11 10:10:44
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-06-27 23:06:58
 */
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'
import { ConfigProvider } from 'antd'
import { store } from '@/store'
import { storeContext } from '@/contexts/storeContext'

ReactDOM.render(
  <BrowserRouter>
    <ConfigProvider locale={zh_CN}>
      <Provider {...store}>
        <storeContext.Provider value={store}>
          <App />
        </storeContext.Provider>
      </Provider>
    </ConfigProvider>
  </BrowserRouter>,
  document.getElementById('root')
)
serviceWorker.unregister()
