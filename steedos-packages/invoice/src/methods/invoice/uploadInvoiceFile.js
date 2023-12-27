/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-07 14:28:46
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-11-02 16:11:11
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/invoice/src/methods/invoice/uploadInvoiceFile.js
 * @Description: 服务端调用上传文件action
 */
"use strict";
// @ts-check
const { Readable } = require('stream');
module.exports = {
    /**
     * 上传文件
     * @param {string} filename 文件名
     * @param {string} fileData 文件内容base64字符串
     * @param {string} ownerId 用户id
     * @returns 
     */
    async handler(filename, fileData, ownerId) {
        // console.log(require('chalk').red('fileData'), fileData.substring(0, 100))
        const stream = Readable.from(Buffer.from(fileData, 'base64'))
        const fileDoc = await this.broker.call('~packages-@steedos/service-files.uploadCollectionFile', stream, {
            meta: {
                filename,
                owner: ownerId
            }
        })

        return fileDoc;
    }
}