'use strict'
import service from './http'

import config from './config'


/**
 * 列表
 */
export var datasourceinfos = data => {
	return service({
		url: config['dataUrl'] + '/datasourceinfos',
		method: 'get',
		params: data
	})
}

/**
 * 添加或修改信息
 */
export var savedatasourceinfo = data => {
	return service({
		url: config['dataUrl'] + '/savedatasourceinfo',
		method: 'get',
		params: data
	})
}


/**
 * 删除信息
 */
export var deldatasourceinfoinfo = data => {
	return service({
		url: config['dataUrl'] + '/deldatasourceinfo',
		method: 'get',
		params: data
	})
}
