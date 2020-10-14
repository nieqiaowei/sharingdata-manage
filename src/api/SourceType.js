'use strict'
import service from './http'

import config from './config'


/**
 * 列表
 */
export var sourcetypeinfos = data => {
	return service({
		url: config['dataUrl'] + '/sourcetypeinfos',
		method: 'get',
		params: data
	})
}

/**
 * 添加或修改信息
 */
export var savesourcetypeinfo = data => {
	return service({
		url: config['dataUrl'] + '/savesourcetypeinfo',
		method: 'get',
		params: data
	})
}


/**
 * 删除信息
 */
export var delsourcetypeinfoinfo = data => {
	return service({
		url: config['dataUrl'] + '/delsourcetypeinfoinfo',
		method: 'get',
		params: data
	})
}
