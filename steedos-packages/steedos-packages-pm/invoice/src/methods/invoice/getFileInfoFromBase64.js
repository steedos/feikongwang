/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-31 17:50:34
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-11-02 16:07:26
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/invoice/src/methods/invoice/getFileInfoFromBase64.js
 * @Description: 
 */

module.exports = {
    handler(fileBase64) {
        const data = fileBase64.replace(/^data:\w+\/\w+;base64,/, '');
        const mimetype = fileBase64.split(",")[0].match(/:(.*?);/)[1];
        return {
            mime: mimetype,
            data: data
        }
    }
}