'use strict'
import service from './http'

import config from './config'


/**
 * 列表
 */
export var dataroleinfos = data => {
	return service({
		url: config['dataUrl'] + '/dataroleinfos',
		method: 'get',
		params: data
	})
}

/**
 * 添加或修改信息
 */
export var saveroleinfo = data => {
	return service({
		url: config['dataUrl'] + '/saveroleinfo',
		method: 'get',
		params: data
	})
}


/**
 * 删除信息
 */
export var delroleinfo = data => {
	return service({
		url: config['dataUrl'] + '/delroleinfo',
		method: 'get',
		params: data
	})
}