import axios from 'axios'
import QS from 'qs'

// 切换环境
if (process.env.NODE_ENV == 'development') { //开发环境
  axios.defaults.baseURL = '';
} else if (process.env.NODE_ENV == 'production') { //生产环境
  axios.defaults.baseURL = ''; //正式服务器的地址
}
// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.withCredentials = true; //跨域请求时是否需要使用凭证
// axios.defaults.timeout = 1000 * 10; //10s
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
// axios.defaults.withCredentials = true;
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // if(response.data.code === '200'){
  //   return Promise.resolve(response)
  // }
  //   console.log('response',response);
  // 对响应数据做点什么
  return Promise.resolve(response);
}, function (error) {
  // alert(error.response.status)
  // 对响应错误做点什么
  return Promise.reject(error);
});
// get请求
export function get(url, params, headers = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params,
      headers: headers
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
// post请求
export function post(url, params = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      data: QS.stringify(params),
      url,
      headers
      // headers:Object.assign(header,headers),
    }
    axios(options).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

//post请求，不用qs转换数据（部分后端由于不是自己写的，不好修改，传数据不能用qs转换data）
export function postNoQs(url, params = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      data: params,
      url,
      headers,
    }
    axios(options).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}


//delete请求
export function deleteRQ(url, params = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    axios.delete(url, {
      params: params,
      headers: headers
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })

}
//上传数据
export function upload(url, params = new FormData, headers = {
  'content-type': 'multipart/form-data'
}) {
  let header = JSON.parse(sessionStorage.getItem('logHeader'));
  return new Promise((resolve, reject) => {
    axios.post(url, params, {
      headers: Object.assign(header, headers)
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
//下载数据
export function download(url, params) {
  return new Promise((resolve, reject) => {
    axios.request({
      url: url,
      params: params,
      method: 'get',
      responseType: 'blob'
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

// 导出excel数据
export function getExcel(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params,
      responseType: 'blob'
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
export default axios