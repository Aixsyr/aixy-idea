import { AxiosRequestConfig } from 'axios'
import { ramCache, localCache } from '@/utils/storage/aStorage'

/**
 * 
 * @param config 请求配置
 * @param method 请求方法类型
 * @param interval 重复间隔时间
 * @returns 
 */
function RepeatSubmit(config: AxiosRequestConfig, method: Array<string>, interval: number) {
    if (method.includes(config.method || '')) {
        const requestObj = {
            url: config.url,
            data: config.data,
            time: new Date().getTime()
        }
        const sessionObj = ramCache.get('sessionObj')
        if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
            ramCache.set('sessionObj', requestObj)
        } else {
            const _url = sessionObj.url;                  // 请求地址
            const _data = sessionObj.data;                // 请求数据
            const _time = sessionObj.time;                // 请求时间
            const _interval = interval;                         // 间隔时间(ms)，小于此时间视为重复提交
            if (_data === requestObj.data && requestObj.time - _time < _interval && _url === requestObj.url) {
                const message = '数据正在提交中...';
                return Promise.reject(new Error(message))
            } else {
                ramCache.set('sessionObj', requestObj)
            }
        }
    }
}

function paramsSerializer(config: AxiosRequestConfig) {
    if (config.method === 'get' && config.params) {
        let url = config.url + '?' + tansParams(config.params);
        url = url.slice(0, -1);
        config.params = {};
        config.url = url;
    }
}

function setHeadersToken(config: AxiosRequestConfig) {
    let token = localCache.get('getToken')
    if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = 'Bearer ' + token
    }
}

// 参数转化
function tansParams(params: any) {
    let result = ''
    for (const propName of Object.keys(params)) {
        const value = params[propName];
        var part = encodeURIComponent(propName) + "=";
        if (value !== null && typeof (value) !== "undefined") {
            if (typeof value === 'object') {
                for (const key of Object.keys(value)) {
                    if (value[key] !== null && typeof (value[key]) !== 'undefined') {
                        let params = propName + '[' + key + ']';
                        var subPart = encodeURIComponent(params) + "=";
                        result += subPart + encodeURIComponent(value[key]) + "&";
                    }
                }
            } else {
                result += part + encodeURIComponent(value) + "&";
            }
        }
    }
    return result
}

export { RepeatSubmit, paramsSerializer, setHeadersToken }