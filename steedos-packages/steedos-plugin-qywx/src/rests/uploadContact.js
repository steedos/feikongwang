"use strict";

const _ = require('lodash')
const xlsx = require("node-xlsx");

module.exports = {
    rest: {
        method: 'POST',
        fullPath: '/api/qiyeweixin/suite/uploadContact'
    },
    params: {
        file: { type: 'string' }, // 文件内容
        filename: { type: 'string' }, // 文件名
    },
    async handler(ctx) {
        try {
            const userSession = ctx.meta.user
            const { spaceId, userId } = userSession
            const { file: fileBase64, filename } = ctx.params
            const fileInfo = this.getFileInfoFromBase64(fileBase64)
            const mimetype = fileInfo.mime
            const fileData = fileInfo.data

            const userObj = this.getObject('users')
            const spaceUserObj = this.getObject('space_users')
            
            let workbook = xlsx.parse(Buffer.from(fileData, 'base64'));
            let excelData = workbook[0].data;
            
            for(let info of excelData){
                console.log("info: ",info);
            }
            // console.log("workbook-----:", workbook[0])

            return {
                "status": 0,
                "msg": "ok",
                "data": {}
            }
        } catch (error) {
            console.log("error: ", error)
        }

    }
}