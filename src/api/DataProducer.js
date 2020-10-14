'use strict'
import service from './http'

import config from './config'


/**
 * 列表
 */
export var dataproducerinfos = data => {
	return service({
		url: config['dataUrl'] + '/dataproducerinfos',
		method: 'get',
		params: data
	})
}

/**
 * 添加或修改信息
 */
export var saveproducerinfo = data => {
	return service({
		url: config['dataUrl'] + '/saveproducerinfo',
		method: 'get',
		params: data
	})
}


/**
 * 删除信息
 */
export var delproducerinfo = data => {
	return service({
		url: config['dataUrl'] + '/delproducerinfo',
		method: 'get',
		params: data
	})
}

/**
 * 数据表信息
 */
export var datasourcetablesinfo = data => {
	return service({
		url: config['dataUrl'] + '/datasourcetablesinfo',
		method: 'get',
		params: data
	})
}

/**
 * 数据表字段信息
 */
export var datasourcecloumninfo = data => {
	return service({
		url: config['dataUrl'] + '/datasourcecloumninfo',
		method: 'get',
		params: data
	})
}

/**
 * 数据表生成信息
 */
export var datasourcesqlinfo = data => {
	return service({
		url: config['dataUrl'] + '/datasourcesqlinfo',
		method: 'get',
		params: data
	})
}


/**
 * 数据表生成信息
 */
export var datasourceparameterinfo = data => {
	return service({
		url: config['dataUrl'] + '/datasourceparameterinfo',
		method: 'post',
		params: data
	})
}

