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
            const spaceObj = this.getObject('spaces')
            const orgObj = this.getObject('organizations')
            
            let workbook = xlsx.parse(Buffer.from(fileData, 'base64'));
            let excelData = workbook[0].data;
            excelData.shift();

            let corpid = excelData[0][3];
            console.log("data1: ",corpid);
            let authSpace = await spaceObj.findOne({filters: [['qywx_corp_id', "=", corpid]] });
            console.log("uploadcontact_spaceObj",authSpace);
            for(let info of excelData){
                console.log("info: ",info);
                // 更新部门
                if(info[0] == "department"){
                    let qywxOrgId = info[1].toString();
                    let orgName = info[2];
                    let parentOrgId;
                    let org = await orgObj.findOne({ filters: [['qywx_id', "=", qywxOrgId], ['qywx_space', "=", info[3]]] });
                    let parentOrg = await orgObj.findOne({ filters: [['qywx_id', "=", info[4]], ['qywx_space', "=", info[3]]] });
                    if(parentOrg){
                        parentOrgId = parentOrg._id;
                    }
                    if (org){
                        await orgObj.update(org._id,{
                            name: orgName,
                            parent: parentOrgId,
                            sort_no: info[5],
                        })
                    }else{
                        await orgObj.insert({
                            name: orgName,
                            parent: parentOrgId,
                            sort_no: info[5],
                            // owner: authSpace.owner,
                            space: authSpace._id,
                            qywx_id: qywxOrgId,
                            qywx_space: info[3],
                        })
                    }
                }
                
                // 更新用户
                if (info[0] == "user"){
                    let qywxUserId = info[1].toString();
                    let userName = info[2];
                    let spaceUser = await spaceUserObj.findOne({ filters: [['qywx_id', "=", qywxUserId], ['qywx_space', "=", info[3]]] });
                    if (spaceUser){
                        await spaceUserObj.update(org._id,{
                            name: userName,
                        })
                    }else{
                        let insertObj = {}
                        insertObj.corpid = corpid;
                        insertObj.name = userName;
                        insertObj.userid = qywxUserId;
                        const userInfo = await broker.call('@steedos/plugin-qywx.createSpaceUser', {
                            "user": insertObj
                        });
                        // console.log("userInfo======", userInfo);
                    }
                }
            }

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