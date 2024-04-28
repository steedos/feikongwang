/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-08-06 15:34:32
 * @LastEditors: 廖大雪 liaodaxue@steedos.com
 * @LastEditTime: 2024-01-08 02:11:50
 * @Description:
 */
const util = require('@steedos/utils');
const filters = require('@steedos/filters');
const _ = require('lodash');

module.exports = {
  cms_sites_beforeFind: {
    trigger: {
      listenTo: "cms_sites",
      when: ["beforeFind"],
    },
    async handler(ctx) {
      const { userId, spaceId, query, id } = ctx.params;

      if(!userId || id){
        return ;
      }

      const userSession = await ctx.broker.call(
        "@steedos/service-accounts.getUserSession",
        { userId: userId, spaceId: spaceId }
      );
      // 工作区管理员可看所有
      if (userSession && userSession.is_space_admin) {
        return;
      }
      // 工作区管理员 和 站点成员 或者 站点配置了 “可见性：公开 - 所有用户可见” 可查看
      const siteFilters = [
        // ["owner", "=", userId],
        // "or",
        ["admins", "=", userId],
        "or",
        ['visibility','=','team']
      ];
      // console.log('query==>', JSON.stringify(query));
      if (_.isString(query.filters)) {
        return {
          query: {
            ...query,
            filters: `(${
              query.filters
            }) and (${filters.formatFiltersToODataQuery(siteFilters)})`,
          },
        };
      } else if(!query.filters){
        return {
          query: {
            ...query,
            filters: `(${filters.formatFiltersToODataQuery(siteFilters)})`,
          },
        };
      }
      else {
        return {
          query: {
            ...query,
            filters: `(${filters.formatFiltersToODataQuery(
              query.filters
            )}) and (${filters.formatFiltersToODataQuery(siteFilters)})`,
          },
        };
      }
    },
  },
  cms_sites_beforeInsert: {
    trigger: {
      listenTo: "cms_sites",
      when: ["beforeInsert"],
    },
    async handler(ctx) {
      const { doc, userId } = ctx.params;

      if (!userId) {
        throw new Error("cms_error_login_required");
      }

      return { doc };
    },
  },
  cms_sites_beforeUpdate: {
    trigger: {
      listenTo: "cms_sites",
      when: ["beforeUpdate"],
    },
    async handler(ctx) {
      const { doc, userId, spaceId, id } = ctx.params;
      if (!userId) {
        throw new Error("cms_error_login_required");
      }

      const userSession = await ctx.broker.call('@steedos/service-accounts.getUserSession', {userId: userId, spaceId: spaceId});
      const is_space_admin = userSession && userSession.is_space_admin;
      const is_admin = doc.admins && doc.admins.indexOf(userId) > -1;
      // 只有工作区管理员和站点成员可以修改站点
      if (!is_space_admin && !is_admin) {
          throw new Error("cms_sites_error_no_permission_to_modify");
      }

      return { doc };
    },
  },
  cms_sites_beforeDelete: {
    trigger: {
      listenTo: "cms_sites",
      when: ["beforeDelete"],
    },
    async handler(ctx) {
      const { userId, spaceId, id } = ctx.params;
      if (!userId) {
        throw new Error("cms_error_login_required");
      }
      
      const userSession = await ctx.broker.call('@steedos/service-accounts.getUserSession', {userId: userId, spaceId: spaceId});
      const is_space_admin = userSession && userSession.is_space_admin;
      const doc = await ctx.broker.call(`objectql.findOne`, {objectName: 'cms_sites', id: id, fields: ["_id","admins"]});
      const is_admin = doc.admins && doc.admins.indexOf(userId) > -1;
      // 只有工作区管理员和站点成员可以删除站点
      if (!is_space_admin && !is_admin) {
          throw new Error("cms_sites_error_no_permission_to_delete");
      }
      
      const category = await ctx.broker.call(`objectql.count`, {
        objectName: "cms_categories",
        query: {
          filters: ["site", "=", id]
        }
      });
      if (category > 0) {
        throw new Error("cms_sites_error_has_categories");
      }
      const post = await ctx.broker.call(`objectql.count`, {
        objectName: "cms_posts",
        query: {
          filters: ["site", "=", id]
        }
      });
      if (post > 0) {
        throw new Error("cms_sites_error_has_posts");
      }
    },
  },
};
