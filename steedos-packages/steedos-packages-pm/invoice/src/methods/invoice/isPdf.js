/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-09-27 15:56:41
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-09-28 16:55:58
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/invoice/src/methods/invoice/isPdf.js
 * @Description: 
 */
const consts = require('../../consts')
module.exports = {
    handler(mimetype) {
        return consts.PDF_MIMETYPES.includes(mimetype)
    }
}