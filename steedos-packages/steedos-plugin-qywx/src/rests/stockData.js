const fetch =  require('node-fetch');
const qywxSync = require('../sync');
const Qiyeweixin = require("../qywx");
module.exports = {
    rest: {
        method: "GET",
        fullPath: "/api/qiyeweixin/stockData",
        authorization: false,
        authentication: false
    },
    async handler(ctx) {
        //同步数据
        let space = await Qiyeweixin.getSpace();
        let access_token = '';
        // 获取access_token
        if (space.qywx_corp_id && space.qywx_secret){
            let response = await Qiyeweixin.getToken(space.qywx_corp_id, space.qywx_secret);
            access_token = response.access_token
        }
        
        qywxSync.write("================存量数据开始===================")
        qywxSync.write("access_token:" + access_token)

        let deptListRes = await fetch("https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token=" + access_token);
        // console.log("before deptListRes",deptListRes);
        deptListRes = await deptListRes.json()
        // console.log("deptListRes: ",deptListRes)
        deptListRes = deptListRes.department
        // console.log(deptListRes)
        for (let i = 0; i < deptListRes.length; i++) {
            qywxSync.write("部门ID:" + deptListRes[i]['id'])
            await qywxSync.deptinfoPush(deptListRes[i]['id'], deptListRes[i]['name'], deptListRes[i]['parentid'])

            let userListRes = await fetch("https://qyapi.weixin.qq.com/cgi-bin/user/simplelist?access_token=" + access_token + "&department_id=" + deptListRes[i].id)
            userListRes = await userListRes.json()
            userListRes = userListRes.userlist
            for (let ui = 0; ui < userListRes.length; ui++) {
                await qywxSync.userinfoPush(userListRes[ui]['userid'])
            }
        }
        return { message: "ok" };
    } 
}