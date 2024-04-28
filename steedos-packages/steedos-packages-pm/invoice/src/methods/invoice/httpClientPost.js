/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-09-27 14:49:31
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-10 13:27:11
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/invoice/src/methods/invoice/httpClientPost.js
 * @Description: 
 */
const request = require('request')

/**
 * 调用百度接口
 * @param string url 请求地址
 * @param object form 请求参数
 * @return object 结果
 */
module.exports = {
    async handler(url, form) {
        const options = {
            'method': 'POST',
            'url': `${url}?access_token=` + await this.getAccessToken(),
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            form
        };

        return new Promise((resolve, reject)=>{
            request(options, function (error, response) {
                if (error) reject(error);
                console.log(response.body)
                resolve(JSON.parse(response.body))
            });
        })
    }
}