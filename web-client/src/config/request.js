import axios from 'axios'
import {
  Message,
  MessageBox
} from 'element-ui'
// import {
//   getToken
// } from './auth'
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000, // 请求超时时间
//   headers: {
    // 'Access-Control-Allow-Origin': 'http://smartair.haier.net',
    // 'Content-Type': 'application/json'
//   },
})


// respone拦截器
service.interceptors.response.use(
  response => {
    if(res.code=='00000'){
      return response
    }else{
      Message({
        message: res.msg,
        type: 'error',
        duration: 5 * 1000
        })
        
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
