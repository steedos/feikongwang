/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-09-27 15:34:59
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-09-28 16:55:50
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/invoice/src/methods/invoice/isImage.js
 * @Description: 判断是否是图片
 */
const consts = require('../../consts')
module.exports = {
    handler(mimetype) {
        return consts.IMAGE_MIMETYPES.includes(mimetype)
    }
}