// 创建space_users
const fetch = require('node-fetch');
module.exports = {
    handler: async function (ctx) {
        const { user } = ctx.params
        console.log("单点登录", user)
        const spaceObj = this.getObject('spaces');
        const usersObj = this.getObject('users');
        const spaceUsersObj = this.getObject("space_users");
        const organizationsObj = this.getObject("organizations");

        // 根据corpid 在space查询记录
        const spaceDoc = await spaceObj.findOne({ filters: [['qywx_corp_id', '=', user.corpid]] });
        // console.log("spaceDoc", spaceDoc)
        try {
            let  userInfo = {}
            if (spaceDoc) {
                // 根据企业微信userid查询user
                let spaceUserDoc = await spaceUsersObj.findOne({ filters: [['qywx_id', '=', user.userid], ['space', '=', spaceDoc._id]] });
                // 获取根部门
                let organizationDoc = await organizationsObj.findOne({ filters: [['space', '=', spaceDoc._id], ["is_company", '=', true]] })

                if (spaceUserDoc) {
                    userInfo = {
                        id: spaceUserDoc._id,
                        userId: spaceUserDoc.user,
                        organizations: spaceUserDoc.organizations,
                        spaceId: spaceDoc._id
                    };
                } else {
                    let userDoc = await usersObj.findOne({ filters: [['qywx_id', '=', user.userid]] });
                    if (!userDoc) {
                        // 创建space_users && user
                        let newSpaceUser = await spaceUsersObj.insert({
                            name: user.name,
                            qywx_id: user.userid,
                            space: spaceDoc._id,
                            locale: "zh-cn",
                            organizations: new Array(organizationDoc._id),
                            organization: organizationDoc._id,
                            user_accepted: true
                        })
                        console.log("newSpaceUser", newSpaceUser);

                        await usersObj.directUpdate(newSpaceUser.user, {
                            qywx_id: user.userid,
                            user_accepted: true
                        })
                        await spaceUsersObj.directUpdate(newSpaceUser._id, {
                            user_accepted: true,
                            invite_state: "accepted"
                        })
                        userInfo = {
                            id: newSpaceUser._id,
                            userId: newSpaceUser.user,
                            organizations: newSpaceUser.organizations,
                            spaceId: spaceDoc._id,
                        }

                    } else {
                        // 创建space_users
                        let newSpaceUser = await spaceUsersObj.insert({
                            name: user.userid,
                            qywx_id: user.userid,
                            space: spaceDoc._id,
                            locale: "zh-cn",
                            user: userDoc._id,
                            organizations: new Array(organizationDoc._id),
                            organization: organizationDoc._id
                        })
                        await spaceUsersObj.directUpdate(newSpaceUser._id, {
                            user_accepted: true,
                            invite_state: "accepted"
                        })
                        userInfo = {
                            id: newSpaceUser._id,
                            userId: newSpaceUser.user,
                            organizations: newSpaceUser.organizations,
                            spaceId: spaceDoc._id,
                        }
                    }

                }

            }
            return userInfo
        } catch (error) {
            console.log("Create sapce_user error: ", error);
        }

    }
}