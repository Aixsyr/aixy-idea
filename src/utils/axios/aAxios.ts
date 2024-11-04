import axios from 'axios'
import { RepeatSubmit, paramsSerializer, setHeadersToken } from './aAxiosRequest'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

const baseURL = process.env.BASE_API;
if (!baseURL) {
  throw new Error('BASE_API 环境变量未定义');
}
const _aAxios = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 12000
})

// 请求拦截器
_aAxios.interceptors.request.use(config => {
  //重复提交拦截
  RepeatSubmit(config, ['post', 'put', 'delete'], 100)
  //设置token
  // setHeadersToken(config)
  //参数转化
  paramsSerializer(config)

  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

// 响应拦截器
_aAxios.interceptors.response.use(res => {
  // 二进制数据则直接返回
  if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
    return res.data
  }
  if (res.headers['content-type'] === 'application/octet-stream;charset=utf-8') {
    return res.data
  }
  return res.data
},
  error => {
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    console.log(message)
    console.log('err' + error)
    return Promise.reject(error)
  }
)

const aAxios = {
  // 发起GET请求
  get: (url: string, arg?: any) => _aAxios({ url, method: 'get', params: arg }),
  // 发起带参数的GET请求
  getRestful: (url: string, arg: string) => _aAxios({ url: `${url}/${arg}`, method: 'get' }),
  // 发起POST请求
  post: (url: string, arg?: any) => _aAxios({ url, method: 'post', data: arg }),
  // 发起表单数据的POST请求
  postFormData: (url: string, arg: any) => {
    return _aAxios({
      url,
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: arg
    });
  },
  // 发起PUT请求
  put: (url: string, arg?: any) => _aAxios({ url, method: 'put', data: arg }),
  // 发起DELETE请求
  delete: (url: string, arg?: any) => _aAxios({ url, method: 'delete', params: arg }),
  // 发起带参数的DELETE请求
  deleteRestful: (url: string, arg: string) => _aAxios({ url: `${url}/${arg}`, method: 'delete' }),
};

export default aAxios