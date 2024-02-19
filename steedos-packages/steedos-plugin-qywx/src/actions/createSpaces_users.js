// 创建space_users
const fetch = require('node-fetch');
module.exports = {
    handler: async function (ctx) {
        const { user } = ctx.params
        console.log("创建==user",user)
        const spaceObj = this.getObject('spaces');
        const usersObj = this.getObject('users');
        const spaceUsersObj = this.getObject("space_users");
        const organizationsObj = this.getObject("organizations");

        // 根据corpid 在space查询记录
        const spaceDoc = await spaceObj.findOne({ filters: [['qywx_corp_id', '=', user.corpid]] });
        console.log("spaceDoc",spaceDoc)
        try {
            if (spaceDoc) {
                // 根据企业微信userid查询user
                let userDoc = await usersObj.findOne({ filters: [['qywx_id', '=', user.userid]] });
                let spaceUserDoc = await spaceUsersObj.findOne({ filters: [['qywx_id', '=', user.userid],['space', '=', spaceDoc._id]] });
                if (userDoc && spaceUserDoc) {
                    return {
                        userId:userDoc._id,
                        spaceId:spaceDoc._id
                    };
                } else {
                    // 获取根部门
                    let organizationDoc = await organizationsObj.findOne({ filters: [['space', '=', spaceDoc._id],["is_company", '=', true]] })
                    // 创建space_users
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
                    
                    await usersObj.directUpdate(newSpaceUser.user,{
                        qywx_id: user.userid,
                        user_accepted: true
                    })
                    await spaceUsersObj.directUpdate(newSpaceUser._id,{
                        user_accepted: true,
                        invite_state: "accepted"
                    })
    
                    return {
                        userId: newSpaceUser.user,
                        spaceId: spaceDoc._id
                    }
                   
                }
    
            }
        } catch (error) {
            console.log("Create sapce_user error: ",error);
        }   
        
    }
}