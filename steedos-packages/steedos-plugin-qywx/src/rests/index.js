/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-09-27 14:45:00
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-09-27 16:45:37
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/invoice/src/methods/index.js
 * @Description: 
 */
module.exports = {
    mainpage: require('./mainpage'),
    push: require('./push'),
    stockData: require('./stockData'),
    listen: require('./listen'),
    callback: require('./callback'),
    downloadContact: require('./downloadContact'),
    uploadContact: require('./uploadContact'),
    getContactResult: require('./getContactResult'),
    syncQywxId: require('./syncQywxId'),
    // getAuthLogin: require('./getAuthLogin'),
}