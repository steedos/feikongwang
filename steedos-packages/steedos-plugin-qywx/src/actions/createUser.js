// 新增users表
module.exports = {
    handler: async function (ctx) {

        return await this.getObject("users").directInsert(ctx.params.doc)
          
    }
}