/*
 * @Description: axios封装
 * @Author: longzhang6
 * @Date: 2020-04-11 15:07:54
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-07-06 23:30:27
 */
import axios from 'axios'
import { message } from 'antd'

const noerrMsgWhitelist = ['/Organize/DeleteDepartment']

const service = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_BASE_API
      : 'https://www.liehuo360.com:360',
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})
// request interceptor
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)
// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.success !== 1) {
      if (!noerrMsgWhitelist.includes(response.config.url)) {
        message.error(res.errorMsg)
      }
      return Promise.reject(res.errorMsg || 'Error')
    } else {
      return res
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
