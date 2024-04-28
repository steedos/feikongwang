module.exports = {
  getPostPreviewDoc: {
    rest: {
      method: "GET",
      path: "/cms_posts/:postId/preview",
      authentication: false,
      authorization: false,
    },
    async handler(ctx) {
      const { postId, userId } = ctx.params;
      const doc = await ctx.broker.call(`objectql.findOne`, {objectName: 'cms_posts', id: postId, fields: ["name", "summary", "body", "htmlBody"]});
      return { status: 0, data: doc }
    }
  }
};
