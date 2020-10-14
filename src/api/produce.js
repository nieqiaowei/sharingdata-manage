'use strict'
import service from './http'

import config from './config'

/**
 * 生产者列表
 */
export var GetProducerInfos = data => {
  return service({
    url: config['dataUrl']+'/getproducerinfos',
    method: 'get',
    params: data
  })
}




