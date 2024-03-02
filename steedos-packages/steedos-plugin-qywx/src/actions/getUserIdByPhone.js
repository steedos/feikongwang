// 根据mobile获取qywxId
const qywx_api = require('../router');
const fetch = require('node-fetch');
module.exports = {
    handler: async function (ctx) {
        console.log("ctx.params: ", ctx.params);
        const { corpid, suite_id, mobile } = ctx.params;
        const spaceObj = this.getObject('spaces');
        const spaceUserObj = this.getObject('space_users');

        let authSpace = await spaceObj.findOne({ filters: [['qywx_corp_id', '=', corpid]] })

        let accessTokenObj = await this.broker.call('@steedos/plugin-qywx.getAccessToken', {
            "suite_id": suite_id,
            "auth_corpid": corpid,
            "permanent_code": authSpace.qywx_permanent_code
        });
        const qyapi = qywx_api.getUerIdByMobile;
        const getUserIdUrl = qyapi + "?access_token=" + accessTokenObj.access_token;
        // 获取信息
        let data = {
            "mobile": mobile || ""
        }
        let updateUsersArrgy = [];

        if (data.mobile) {
            let updateObj = {};
            let response = await fetch(getUserIdUrl, {
                method: 'post',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json());

            if (response.errcode) {
                updateUsersArrgy.push(response)
                return updateUsersArrgy;
            }
            let spaceUser = await spaceUserObj.findOne({ filters: [['space', '=', authSpace._id], ['mobile', '=', mobile]] })

            if (spaceUser) {
                await spaceUserObj.directUpdate(spaceUser._id, {
                    qywx_id: response.userid
                })
                updateObj.updateUser = response.userid;
                updateUsersArrgy.push(updateObj)
            }

        } else {
            let spaceUsers = await spaceUserObj.find({ filters: [['space', '=', authSpace._id]], fields: ['_id', 'mobile'] })
            for (let user of spaceUsers) {
                if (user.mobile) {
                    let updateObj = {};
                    let data = {
                        mobile: user.mobile
                    }
                    let response = await fetch(getUserIdUrl, {
                        method: 'post',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(res => res.json());

                    if (response.errcode) {
                        updateUsersArrgy.push(response)
                        return updateUsersArrgy;
                    }

                    await spaceUserObj.directUpdate(user._id, {
                        qywx_id: response.userid
                    })
                    updateObj.updateUser = response.userid;
                    updateUsersArrgy.push(updateObj)

                }
            }
            // console.log("spaceUsers: ", spaceUsers)
        }

        return updateUsersArrgy;

    }
}