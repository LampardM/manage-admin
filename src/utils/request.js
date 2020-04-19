/*
 * @Description: axios封装
 * @Author: longzhang6
 * @Date: 2020-04-11 15:07:54
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-04-11 18:07:40
 */
import axios from 'axios'

const service = axios.create({
  baseURL: '', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // TODO token配置
    // if (store.getters.token) {
    //   // let each request carry token
    //   // ['X-Token'] is a custom headers key
    //   // please modify it according to the actual situation
    //   config.headers["X-Token"] = getToken();
    // }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    // if the custom code is not 0, it is judged as an error.
    // if (res.code !== 200) {
    //   return Promise.reject(new Error(res.message || 'Error'))
    // } else {
    return res
    // }
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
