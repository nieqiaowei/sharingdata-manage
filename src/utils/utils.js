/**
 * Created by songcxa on 2020/3/25.
 */
const utilsLib={

    /*UUID生成guid
     * @bit (32 || 64)
     * */
    getUUID(bit){
        let tmpBit=bit||32;//
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < tmpBit; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23];
        var uuid = s.join("");
        return uuid;
    },

    //base64格式
    getBase64(file){
        //debugger
        return new Promise(function(resolve, reject) {
            let reader = new FileReader();
            let imgResult = "";
            reader.readAsDataURL(file);
            reader.onload = function() {
                imgResult = reader.result;
            };
            reader.onerror = function(error) {
                reject({code:-1,data:error});
            };
            reader.onloadend = function() {
                if(imgResult !="data:"){
                    resolve({code:200,data:imgResult});
                }else {
                    reject({code:-1,data:imgResult});
                }
            };
        });
    },

    //查找数组中指定对象下标
    findIndexByArray(arr,name,target){
        let tmpIndex="";
        for(let i=arr.length-1; i>=0; i--){
            let tmpObj=arr[i];
            if(tmpObj[name] == target){
                //arr.splice(i,1);
                tmpIndex=i;break
            }
        }
        return tmpIndex;
    },
    //查找数组中指定对象下标数组【0,1,2,3】
    findIndexByArray2(arr,value){
        let tmpIndex="";
        for(let i=arr.length-1; i>=0; i--){
            let tmpObj=arr[i];
            if(tmpObj == value){
                tmpIndex=i;break
            }
        }
        return tmpIndex;
    },

    //获取key
    getDecodeToken(name){
        const roleKey = localStorage.getItem(name);
        //let Authorization=null;
        try {
            return JSON.parse(roleKey);
        }catch(err) {
            return null;
        }
    },

    //时间转换
    formatDateByInt(longInt){
        let date = new Date(longInt);
        let strHour =change(date.getHours()) ;//获取...钟点
        let strMinute = change(date.getMinutes());//获取分钟数
        let strSeconde =change(date.getSeconds());//获取秒钟数
        function change(t) {
            if (t < 10) {
                return "0" + t;
            } else {
                return t;
            }
        }
        let str=date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()+" "+strHour+":"+strMinute+":"+strSeconde;
        return str;
    },

    /*@type:yyyyMMddHHmmss||*/
    formatDateByIntEx(longInt,type){
        let date="";
        if(longInt){//存在即转换
            date = new Date(longInt);
        }else {//不存在获取当前时间
            date = new Date();
        }
        let year=date.getFullYear();
        let month=change(date.getMonth() + 1);
        let day=change(date.getDate());
        let strHour =change(date.getHours()) ;//获取...钟点
        let strMinute = change(date.getMinutes());//获取分钟数
        let strSeconde =change(date.getSeconds());//获取秒钟数
        function change(t) {
            if (t < 10) {
                return "0" + t;
            } else {
                return t;
            }
        }
        let tmpResult="";
        switch (type){
            case"yyyyMMddHHmmss"://20200415000000
                tmpResult=year+month+day+strHour+strMinute+strSeconde;
                break;
            case"yyyyMMdd"://20200415000000
                tmpResult=year+month+day;
                break;
            case"yyyy-MM-ddHH:mm:ss"://20200415000000
                tmpResult=year+"-"+month+"-"+day+" "+strHour+":"+strMinute+":"+strSeconde;
                break;
            default:
                tmpResult=year+"-"+month+"-"+day;
                break;
        }
        return tmpResult;
    },

    //审核状态表
    /*
     * verifyRole: review(复审) | preview(初审)
    * */
    statesChange(cnVal,verifyRole){
        let col_val={
            cn_label:"",
            style:"",
            code:""
        };
       let vState= window.ZHCJAppConfig.verifyStatus;
        switch (cnVal){
            case vState.s10.code://数据正确
                col_val.cn_label="数据正确";
                col_val.style="color:black;cursor: pointer;";
                col_val.code=cnVal;
                break;
            case vState.s11.code://数据有误
                col_val.cn_label="数据有误";
                col_val.style="color:#f56c6c;cursor: pointer;";
                col_val.code=cnVal;
                break;
            case vState.s9.code://未生成
                col_val.cn_label="未生成";
                col_val.style="color:#909399;cursor: pointer;";
                col_val.code=cnVal;
                break;
            case vState.s14.code://初审通过
                col_val.cn_label="初审通过";
                col_val.style="color:#00b0f0;cursor: pointer;";
                col_val.code=cnVal;
                break;
            case vState.s20.code://复审通过
                col_val.cn_label="复审通过";
                col_val.style="color:rgb(60, 179, 113);cursor: pointer;";
                col_val.code=cnVal;
                break;
            case vState.s12.code://复审未通过
                col_val.cn_label="复审未通过";
                col_val.style="color:#e6a23c;cursor: pointer;";
                col_val.code=cnVal;
                break;
            case vState.s21.code://提交发布
                col_val.cn_label="提交发布";
                col_val.style="color:black;cursor: pointer;";
                if(verifyRole=="review"){//复审页面改名"已提交复审"->待复审
                    col_val.cn_label="已发布";
                    col_val.style="color:#606266;";
                }
                col_val.code=cnVal;
                break;
            case vState.s19.code://提交复审
                col_val.cn_label="已提交复审";
                col_val.style="color:#3CB371;cursor: pointer;";
                if(verifyRole=="review"){//复审页面改名"已提交复审"->待复审
                    col_val.cn_label="待复审";
                    col_val.style="color:black;cursor: pointer;";
                }
                col_val.code=cnVal;
                break;
            case vState.s13.code://初审中
                col_val.cn_label="初审中";
                col_val.style="color:black;cursor: pointer;";
                col_val.code=cnVal;
                break;
            default:
                col_val.cn_label=cnVal;
                col_val.code="";
                break;
        }
        return col_val;
    },
    /*
     * 视图对应page
     * */
    viewToPage(viewName){
        let vname="";
        switch (viewName){
            case "gantry_flow_province_specify"://
                vname="gantryFlowProvinceSpecify";
                break;
            case "gantry_flow_whole"://
                vname="gantryFlowWholePage";
                break;
            case "gantry_flow_fee_province"://
                vname="flowFeeWholePage";
                break;
            case "flow_etc_point_province"://
                vname="flowEtcPointPage";
                break;
            case "flow_slowroad"://
                vname="flowSlowroadPage";
                break;
            case "flow_slowstation"://
                vname="flowSlowstationPage";
                break;
            default:
                break;
        }
        return vname;
    },

    /*数组中是否存在指定值*/
    existValByArray(val,arr){
        let res=false;//不存在
        for(let i=0;i<arr.length;i++){
            if(item==arr[i]){
                res=true;break;
            }
        }
    },

};
export default utilsLib;