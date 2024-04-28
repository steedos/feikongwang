module.exports = {
    handler: async function (spaceId, userId, user_accepted, organization_id) {
        const now = new Date();
        const suObj =this.getObject('space_users');
        const spaceObj = this.getObject('spaces')
        const orgObj = this.getObject('organizations')

        const suDoc = (await suObj.directFind({
            filters: [
                ['space', '=', spaceId],
                ['user', '=', userId]
            ]
        }))[0]
        // 如果工作区已存在此用户则不重复添加
        if (suDoc) {
            return;
        }

        let profile = 'user';

        const space = await spaceObj.findOne(spaceId, { fields: ['default_profile', 'default_organization'] })
        if (space) {
            if (space.default_profile) {
                profile = space.default_profile
            }
            if (!organization_id && space.default_organization) {
                organization_id = space.default_organization
            }
        }

        if (!organization_id) {
            const rootOrg = (await orgObj.find({
                filters: [
                    ['space', '=', spaceId],
                    ['parent', '=', null]
                ]
            }))[0]
            organization_id = rootOrg._id
        }

        //company_id,company_ids,organizations_parents由triggers维护
        const spaceUsersDoc = {
            user: userId,
            user_accepted: user_accepted,
            organization: organization_id,
            organizations: [organization_id],
            profile: profile,
            space: spaceId,
            owner: userId,
            created_by: userId,
            created: now,
            modified_by: userId,
            modified: now
        }
        const newsuDoc = await suObj.insert(spaceUsersDoc)
      
    }
}