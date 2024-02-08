
const fetch = require('node-fetch');
const fs = require('fs');
const FormData = require("form-data");
const qywx_api = require('../router');

module.exports = {
    handler: async function (ctx) {
        const { file_path, provider_access_token } = ctx.params;
        // 读取要上传的文件内容
        const fileContent = fs.readFileSync(file_path); // 替换为实际文件路径

        // 构建 FormData 对象来处理表单数据
        const formData = new FormData();
        formData.append('media', fileContent, {
            filename: file_path,
            filelength: fileContent.length
        });

        console.log("fileContent.length: ",fileContent.length);

        let qyapi = qywx_api.uploadFile + "?provider_access_token=" + provider_access_token + "&type=file"; 
        // 发送 POST 请求并上传文件
        let uploadInfo = await fetch(qyapi, {
            method: 'POST',
            headers: {
                'Content-Length': fileContent.length,
                'Content-Type': 'multipart/form-data'
            },
            body: formData
        }).then(res => res.json());
        
        return uploadInfo;
    }
}
