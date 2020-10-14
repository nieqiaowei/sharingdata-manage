import axios from 'axios';
import router from '../router/index';
import utils from '../utils/utils';
const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
    timeout: 8000
});

service.interceptors.request.use(
    config => {
        //debugger
       // let token = window.localStorage.getItem("LWZHDC_tool_data");//统一token值添加
        let token=utils.getDecodeToken("LWZHDC_tool_data");
        if (token) {
            config.headers['Authorization'] = token.authorization;
        }
        config.headers['content-type'] = 'application/json';
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        //debugger
        console.log("code码："+response.data.code);
        try {
            if(response.data.code==200){
                return response.data;
            }else  if(response.data.code==209){
                return router.replace('/login');//需重新登录
            }else {
                return response.data;
            }
        }catch(err) {
            Promise.reject(response);
        }

        //if (response.status === 200) {
        //    return response.data;
        //}
        //else if(response.status==401) {//401重新登录
        //    return router.replace('/login');//需重新登录
        //}
    },
    (error) => {
        //debugger
        console.log(error);
        return Promise.reject();
    }
);

export default service;