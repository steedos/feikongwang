/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-08-06 15:34:32
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-08-30 18:05:54
 * @Description: 
 */


module.exports = {
    cms_categories_beforeInsert: {
        trigger: { 
            listenTo: 'cms_categories', 
            when: ['beforeInsert']
        },
        async handler(ctx) {
            const { doc, userId, spaceId } = ctx.params;

            if (!userId) {
                throw new Error("cms_error_login_required");
            }

            const userSession = await ctx.broker.call('@steedos/service-accounts.getUserSession', {userId: userId, spaceId: spaceId});
            const is_space_admin = userSession && userSession.is_space_admin;
            const site_record = await ctx.broker.call(`objectql.findOne`, {objectName: 'cms_sites', id: doc.site, fields: ["admins"]});
            const is_admin = site_record.admins && site_record.admins.indexOf(userId) > -1;

            // 只有工作区管理员和站点成员可以新建栏目
            if (!is_space_admin && !is_admin) {
                throw new Error("cms_categories_error_no_permission_to_create");
            }

            doc.created_by = userId;
            doc.created = new Date();
            doc.modified_by = userId;
            doc.modified = new Date();
            return doc;
        }  
    },
    cms_categories_beforeUpdate: {
        trigger: { 
            listenTo: 'cms_categories', 
            when: ['beforeUpdate']
        },
        async handler(ctx) {
            const { doc, userId, spaceId, id } = ctx.params;
            if (doc.parent === id) {
                throw new Error("cms_categories_error_deny_set_self");
            }

            const userSession = await ctx.broker.call('@steedos/service-accounts.getUserSession', {userId: userId, spaceId: spaceId});
            const is_space_admin = userSession && userSession.is_space_admin;
            const site_record = await ctx.broker.call(`objectql.findOne`, {objectName: 'cms_sites', id: doc.site, fields: ["_id","admins"]});

            const is_admin = site_record.admins && site_record.admins.indexOf(userId) > -1;
            // 只有工作区管理员和站点成员可以修改栏目
            if (!is_space_admin && !is_admin) {
                throw new Error("cms_categories_error_no_permission_to_modify");
            }
            // doc.modified_by = userId;
            // doc.modified = new Date();
            return {doc};
        }  
    },
    cms_categories_beforeDelete: {
        trigger: { 
            listenTo: 'cms_categories', 
            when: ['beforeDelete']
        },
        async handler(ctx) {
            const { doc, userId, spaceId, id } = ctx.params;

            const userSession = await ctx.broker.call('@steedos/service-accounts.getUserSession', {userId: userId, spaceId: spaceId});
            const is_space_admin = userSession && userSession.is_space_admin;
            const categorie_record = await ctx.broker.call(`objectql.findOne`, {objectName: 'cms_categories', id: id, fields: ["site"]});
            const site_record = await ctx.broker.call(`objectql.findOne`, {objectName: 'cms_sites', id: categorie_record.site, fields: ["admins"]});

            const is_admin = site_record.admins && site_record.admins.indexOf(userId) > -1;
            // 只有工作区管理员和站点成员可以删除栏目
            if (!is_space_admin && !is_admin) {
                throw new Error("cms_categories_error_no_permission_to_delete");
            }

            const records = await ctx.broker.call(`objectql.find`, {objectName: 'cms_categories',query:{ filters: [['parent', '=', id]], fields: ['_id', "site"] } });
            if (records.length > 0) {
                throw new Error("cms_categories_error_has_children");
            }
            const post =await ctx.broker.call(`objectql.find`, {objectName: 'cms_posts', query:{ filters: [['category', '=', id]], fields: ['_id']} });
            if (post.length > 0) {
                throw new Error("cms_categories_error_has_posts");
            }
        }  
    }
     
}
