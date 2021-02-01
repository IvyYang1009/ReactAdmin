/**
 * 能发送异步请求的模块
 * 封装axios的库
 * 统一处理异常
 */
import axios from 'axios'
import { message } from 'antd'
export default function ajax (url, data={}, method='GET') {
    return new Promise((resolve, reject) => {
        let promise
        //1. 执行异步ajax请求
        if(method === 'GET') {
            promise = axios.get(url, {
                params: data
            })
        } else {
            promise = axios.post(url, data)
        }
        //2. 如果成功了，调用resolve（value)
        promise.then(response => {
            resolve(response.data)
        }).catch(error => {
            message.error('请求出错了', + error.message)
        })
        
        
    })
    
}


