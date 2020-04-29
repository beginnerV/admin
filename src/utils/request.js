import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // baseUrl: "https://www.zgtest.club",
  // baseUrl: "https://www.zg.com/",
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['X-Token'] = getToken()
      config.headers['json-web-token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
}
// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    console.log(res)
    // code为非20000是抛错 可结合自己业务进行修改
    // if (res.code !== 20000) {
    console.log(response)

    // 错误码处理
    switch (res.error_code) {
      case 1007:
        return Message({ message: '没有权限' })
      case 3004:
        return Message({ message: '用户不存在' })
      case 3005:
        return Message({ message: '用户名或密码错误' })
      case 1005:
        return Message({ message: '未找到用户' })
    }

    // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
    if (res.error_code == 50008) {
      // to re-login
      MessageBox.confirm(
        '您已注销，您可以取消以停留在此页，或重新登录',
        '确认注销',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
      // return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    var numArr = error.toString().match(/\d+/g)
    var errCode = Number(numArr.join(''))
    // 报错状态码处理
    Message({
      message: codeMessage[errCode] || error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
