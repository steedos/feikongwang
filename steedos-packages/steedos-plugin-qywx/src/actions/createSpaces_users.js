// 创建space_users
module.exports = {
    handler: async function (ctx) {
        const { user,permanentCodeDoc } = ctx.params
        const spaceObj = this.getObject('spaces');
        const usersObj = this.getObject('users');
        const spaceUsersObj = this.getObject("space_users");
        const organizationsObj = this.getObject("organizations");
        // 根据corpid 在space查询记录
        const spaceDoc = await spaceObj.findOne({ filters: [['qywx_corp_id', '=', user.corpid]] });
        if (spaceDoc) {
            // 根据企业微信userid查询user
            const userDoc = await usersObj.findOne({ filters: [['qywx_userid', '=', user.userid]] });
            if (userDoc) {
                // 创建space_users
                await spaceUsersObj.directInsert({
                    qywx_id: user.userid
                })
            } else {
                // 1、创建user
                const newUser = await usersObj.directInsert({
                    name: user.name,
                    qywx_id:user.userid
                    
                })
                console.log("newUser",newUser)
                // 2、创建space_users
                const newSpaceUser = await spaceUsersObj.directInsert({
                    name: "1111111", 
                    user: newUser._id,
                    owner: newUser._id, 
                    created_by: newUser._id,
                    created: new Date(),
                    modified_by: newUser._id,
                    modified: new Date(),
                    qywx_id: user.userid,
                    space: spaceDoc._id,
                    profile: "admin"
                  })
                  console.log("newSpaceUser",newSpaceUser)
            }

        } else {
            // 1、创建user
            const newUser = await usersObj.directInsert({
                name: user.name,
                qywx_id:user.userid
                
            })
            console.log("user",newUser)
            // 2、创建space
            const newSpaces = await spaceObj.directInsert({
                name: "1111111", 
                admins: [newUser._id],
                owner: newUser._id, 
                created_by: newUser._id,
                created: new Date(),
                modified_by: newUser._id,
                modified: new Date(),
                qywx_corp_id: user.corpid
              })
              console.log("newSpaces",newSpaces)
            
              // 3、创建组织机构
              const newOrganizations = await organizationsObj.directInsert({
                name: "1111111", 
                is_company: true,
                owner: newUser._id, 
                created_by: newUser._id,
                created: new Date(),
                modified_by: newUser._id,
                modified: new Date(),
                qywx_id: user.userid,
                space: newSpaces._id,
                users: [newUser._id]
              })

            // 4、创建space_users
            const newSpaceUser = await spaceUsersObj.directInsert({
                name: "1111111", 
                user: newUser._id,
                owner: newUser._id, 
                created_by: newUser._id,
                created: new Date(),
                modified_by: newUser._id,
                modified: new Date(),
                qywx_id: user.userid,
                space: newSpaces._id,
                profile: "admin"
              })

        }

    }
}