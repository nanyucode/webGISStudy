import {get,post,deleteRQ,upload,download,getExcel,postNoQs} from './http'
// 获得或者写入数据 get方法
const axiosGet = function(url,params,headers){
    return get(url,params,headers);
}
// 获得或写入数据 post方法
const axiosPost = function(url,params,headers){
    return post(url,params,headers);
}
//post方法，不使用qs转换data
const axiosPostNoQs = function(url,params,headers){
  return postNoQs(url,params,headers);
}
const axiosDelete = function (url,params,headers) {
  return deleteRQ(url,params,headers);
}
//上传文件
const axiosUpload = function (url,params,headers) {
  return upload(url,params,headers)
}
//下载文件
const axiosDownload = function (url,params) {
  return download(url,params)
}
// 导出excel
const axiosDownFile = function(url,params){
    return getExcel(url,params);
}
export {axiosGet,axiosPost,axiosPostNoQs,axiosDelete,axiosUpload,axiosDownload,axiosDownFile
}

