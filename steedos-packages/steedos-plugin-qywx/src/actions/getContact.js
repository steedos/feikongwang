// 创建space_users
const CryptoJS = require('crypto-js');
const fs = require('fs');
const fetch = require('node-fetch');
const Excel = require('exceljs');

module.exports = {
    handler: async function (ctx) {
        const { space_id, suite_id } = ctx.params;
        const spaceObj = this.getObject('spaces');
        
        let authSpace = await spaceObj.findOne({filters: [['_id', '=', space_id]] })

        let accessTokenObj = await this.broker.call('@steedos/plugin-qywx.getAccessToken', {
            "suite_id": suite_id,
            "auth_corpid": authSpace.qywx_corp_id,
            "permanent_code": authSpace.qywx_permanent_code
        });

        try {
            let workbook = new Excel.Workbook();
            let worksheet = workbook.addWorksheet('Sheet1');
            let fileName = "contactInfo-" + authSpace.qywx_corp_id + ".xlsx";

            worksheet.columns = [
                { header: 'type', key: 'type', width: 10 },
                { header: 'id', key: 'id', width: 10 },
                { header: 'name', key: 'name', width: 20 },
                { header: 'status', key: 'status', width: 10 },
                { header: 'department', key: 'department', width: 10 }
            ];

            let departmentListObj = await this.broker.call('@steedos/plugin-qywx.getDepartmentList', {
                "access_token": accessTokenObj.access_token
            });
            // console.log("departmentListObj:",departmentListObj);

            // 获取人员列表
            let userListObj = await this.broker.call('@steedos/plugin-qywx.getAllUserList', {
                "access_token": accessTokenObj.access_token
            });
            // console.log("userListObj:",userListObj);

            // let idIndex = 0;

            for (let org of departmentListObj.department) {
                // idIndex++;
                // 将$departmentName=1$替换成部门id为1对应的部门名；
                let orgName = "$departmentName=" + org.name + "$";
                worksheet.addRow({ type: "department", id: org.id, name: orgName});
            }

            for (let user of userListObj.userlist) {
                // 有效用户
                if (user.status == 1) {
                    // idIndex++;
                    // 将$userName=lisi007$替换成userid为lisi007对应的用户姓名；
                    let userName = "$userName=" + user.name + "$";
                    worksheet.addRow({ type: "user", id: user.userid, name: userName, status: user.status, department: user.department });
                }
            }

            await workbook.xlsx.writeFile(fileName,{useSharedStrings: true});

            let corpid = process.env.STEEDOS_QYWX_SAAS_SUITE_CORPID;
            let provider_secret = process.env.STEEDOS_QYWX_SAAS_PROVIDER_SECRET;

            // console.log("corpid: ",corpid);

            let providerTokenInfo = await this.broker.call('@steedos/plugin-qywx.getProviderToken', {
                "corpid": corpid,
                "provider_secret": provider_secret
            });

            // console.log("providerTokenInfo: ", providerTokenInfo.provider_access_token);

            let uploadFileInfo = await this.broker.call('@steedos/plugin-qywx.uploadFile', {
                "file_path": fileName,
                "provider_access_token": providerTokenInfo.provider_access_token
            });

            // console.log("uploadFileInfo: ", uploadFileInfo);

            let idTranslateInfo = await this.broker.call('@steedos/plugin-qywx.getIdTranslate', {
                "auth_corpid": authSpace.qywx_corp_id,
                "provider_access_token": providerTokenInfo.provider_access_token,
                "media_id_list": uploadFileInfo.media_id
            });
            
            idTranslateInfo.ServiceCorpId = authSpace.qywx_corp_id;
            console.log("idTranslateInfo: ", idTranslateInfo);
            
            // await this.broker.call('@steedos/plugin-qywx.getResult', {
            //     "provider_access_token": providerTokenInfo.provider_access_token,
            //     "jobid": idTranslateInfo.jobid
            // });

            // console.log("resultInfo: ", resultInfo);
            return idTranslateInfo;
        } catch (error) {
            console.log("errror: ",error);
        }

    }
}