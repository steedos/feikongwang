/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-09-27 14:45:00
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-09-27 16:45:37
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/invoice/src/methods/index.js
 * @Description: 
 */
module.exports = {
    getSpace: require('./getSpace'),
    getToken: require('./getToken'),
    getSpaceUser: require('./getSpaceUser'),
    getUserInfo: require('./getUserInfo'),
    getProviderToken: require('./getProviderToken'),
    getLoginInfo: require('./getLoginInfo'),
    write: require('./write'),
    decrypt: require('./decrypt'),
    userinfoPush: require('./userinfoPush'),
    deptinfoPush: require('./deptinfoPush'),
    useridPush: require('./useridPush'),
    getSpaceUsers: require('./getSpaceUsers'),
    getUserDetail: require('./getUserDetail'),
    updateUserMobile: require('./updateUserMobile'),
    updateUserEmail: require('./updateUserEmail'),
    getSpaceByDingtalk: require('./getSpaceByDingtalk'),
    getSpaceById: require('./getSpaceById'),
    getSpaceTop1: require('./getSpaceTop1'),
}