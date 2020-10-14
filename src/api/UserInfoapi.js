'use strict'
import service from './http'

import config from './config'
/**
 * 用户登录
 */
export var login = data => {
  return service({
    url: config['dataUrl']+'/login',
    method: 'get',
    params: data
  })
}

/**
 * 获取用户公钥
 */
export var getpublickey = data => {
	
	
	
  return service({
    url: config['dataUrl']+'/getpublickey',
    method: 'get',
    params: data,
	
  })
}


/**
 * 用户列表
 */
export var UserAll = data => {
  return service({
    url: config['dataUrl']+'/getuserinfos',
    method: 'get',
    params: data
  })
}

/**
 * 添加或修改用户信息
 */
export var SaveUserInfo = data => {
  return service({
    url: config['dataUrl']+'/saveinfo',
    method: 'get',
    params: data
  })
}


/**
 * 删除用户信息
 */
export var DeleteUserInfo = data => {
  return service({
    url: config['dataUrl']+'/deleteinfo',
    method: 'get',
    params: data
  })
}




