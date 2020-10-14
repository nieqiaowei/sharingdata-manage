import request from '../utils/request';


//示例
export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};


export const fetchDataPost = query => {
    return request({
        url: 'http://59.33.252.219:81/API/GetCongYeRenYuanInfo.do',
        method: 'post',
        params: query
    });
};

//post
export const getHttpPost=(url,params)=>{
    return request({
        url: url,
        method: 'post',
        data: params
    });
}

export const getHttpPostDatajson=(url,params)=>{
    return request({
        url: url,
        method: 'post',
        data: params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',  //指定消息格式
        }
    });
}

export const getHttpPostParams=(url,params)=>{
    return request({
        url: url,
        method: 'post',
        params: params
    });
}

export const getHttpGet=(url,params)=>{
    params=params||{};
    params.t=new Date().getTime();
    return request({
        url: url,
        method: 'get',
        params: params
    });
}

export const getHttpGetBlob=(url,params)=>{
    return request({
        url: url,
        method: 'get',
        params: params,
        responseType:'blob'//服务器返回的数据类型
    });
}

export const getHttpDelete=(url,params)=>{
    return request({
        url: url,
        method: 'delete',
        data: params
    });
}
