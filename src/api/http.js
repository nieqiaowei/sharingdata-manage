'use strict'
/* global axios,qs */
import qs from 'qs'
/** ****创建axios实例**** **/
import axios from 'axios'

var service = axios.create({
  baseURL: '', // api的base_url
  timeout: 30 * 1000 // 请求超时时间
})
let pending = [] // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let CancelToken = axios.CancelToken

var enableUrllist = ['/huizhouanalysis/queryData/basechartsData.do', 
'/huizhouanalysis/queryData/wholoPointData.do',
'/huizhouanalysis/queryData/combineChartsData.do']

let removePending = (ever) => {
  for (let p in pending) {
    if (pending[p].u === ever.url) { // 当当前请求在数组中存在时执行函数体
      pending[p].f() // 执行取消操作
      pending.splice(p, 1) // 把这条记录从数组中移除
    }
  }
}

let enableUrl = function (url) {
  var status = true
  for (var i = 0; i < enableUrllist.length; i++) {
    if (enableUrllist[i] === url) {
      status = false
      break
    }
  }
  return status
}
/** **** request拦截器==>对请求参数做处理 ******/
service.interceptors.request.use(config => {
  config.method === 'post' ? config.data = qs.stringify({
    ...config.data
  }) : config.params = {
    ...config.params
  }
  // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'

  // ------------------------------------------------------------------------------------
  removePending(config) // 在一个ajax发送前执行一下取消操作
  config.cancelToken = new CancelToken((c) => {
    // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
    if (enableUrl(config.url)) {
      pending.push({
        u: config.url,
        f: c
      })
    } else {
      console.info('过滤多个同时相同的请求url')
    }
  })
  // -----------------------------------------------------------------------------------------
  return config
}, error => { // 请求错误处理
  Promise.reject(error)
})

/** **** respone拦截器==>对响应做处理 ******/
service.interceptors.response.use(
  response => { // 成功请求到数据
    // ------------------------------------------------------------------------------------------
    removePending(response.config) // 在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
    // -------------------------------------------------------------------------------------------
    return response
  },
  error => { // 响应错误处理
    console.log('error')
    console.log(error)
    console.log(JSON.stringify(error))

    let text = '服务异常！'
    console.error(text)
    return Promise.reject(error)
  }
)
export default service
