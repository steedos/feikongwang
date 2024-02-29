module.exports = {
    handler: async function (ctx) {
        const { message } = ctx.params;
        const spaceObj = this.getObject('spaces');
        const orgObj = this.getObject('organizations');
        const spaceUserObj = this.getObject('space_users');
        const userObj = this.getObject('users');
        let changeType = message.ChangeType;
        let authSpace = await spaceObj.findOne({filters: [['qywx_corp_id', '=', message.AuthCorpId]] })

        try {
            if (authSpace){
                if (changeType == "delete_party"){
                    let org = await orgObj.findOne({filters: [['space', '=', authSpace._id],['qywx_id', '=', message.Id]] })
                    if (org){
                        await orgObj.directUpdate(org._id,{
                            "hidden" : true,
                        })
                    }
                    
                }

                if (changeType == "delete_user"){
                    let spaceUser = await spaceUserObj.findOne({filters: [['space', '=', authSpace._id],['qywx_id', '=', message.UserID]] })
                    if (spaceUser){
                        await spaceUserObj.directUpdate(spaceUser._id,{
                            "user_accepted" : false,
                        })

                        await userObj.directUpdate(spaceUser.user,{
                            "user_accepted" : false,
                        })
                    }
                    
                }
            }
        } catch (error) {
            console.log("change contact errror: ",error);
        }

    }
}