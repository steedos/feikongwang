/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-09-27 14:45:34
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-09-27 17:24:19
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/invoice/src/methods/invoice/getAccessToken.js
 * @Description: 
 */
const request = require('request')
const consts = require('../../consts')
/**
 * 使用 AK，SK 生成鉴权签名（Access Token）
 * @return string 鉴权签名信息（Access Token）
 */
module.exports = {
    handler() {
        const { AK, SK } = this.settings
        if (!AK || !SK) {
            throw new Error(consts.NEED_CONFIG_AK_AND_SK);
        }
        let options = {
            'method': 'POST',
            'url': 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + AK + '&client_secret=' + SK,
        }
        return new Promise((resolve, reject) => {
            request(options, (error, response) => {
                if (error) { reject(error) }
                else { resolve(JSON.parse(response.body).access_token) }
            })
        })
    }
}

