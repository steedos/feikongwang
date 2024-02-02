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
        if (spaceDoc) {
            // 根据企业微信userid查询user
            const userDoc = await usersObj.findOne({ filters: [['qywx_id', '=', user.userid]] });
            const spaceUserDoc = await spaceUsersObj.findOne({ filters: [['user', '=', user._id]] });
            if (userDoc && spaceUserDoc) {
                 return {
                    userId:userDoc._id,
                    spaceId:spaceDoc._id
                };
            } else {
                // 1、创建user
                const newUser = await usersObj.directInsert({
                    name: user.name,
                    qywx_id: user.userid

                })
                console.log("newUser", newUser)
                // 2、创建space_users
                const newSpaceUser = await spaceUsersObj.directInsert({
                    name: user.name,
                    user: newUser._id,
                    owner: newUser._id,
                    created_by: newUser._id,
                    created: new Date(),
                    modified_by: newUser._id,
                    modified: new Date(),
                    qywx_id: user.userid,
                    space: spaceDoc._id,
                    profile: "user",
                    user_accepted: true
                })
                console.log("newSpaceUser", newSpaceUser);

                return {
                    userId:newUser._id,
                    spaceId:spaceDoc._id
                }
               
            }

        } 



    }
}