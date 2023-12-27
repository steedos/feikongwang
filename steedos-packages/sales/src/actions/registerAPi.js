// 注册用户
module.exports = {
    rest: {
        method: 'POST',
        path: '/register/user',
        authorization: false,
        //authentication: false,
    },
    params: {
        user: {
            type: 'object',
            optional: true
        }
    },
    handler: async function (ctx) {
        const {user} = ctx.params;
        console.log("=======>",ctx);
        console.log("user",user);
        const leadsObj = this.getObject("leads");
        const leadsDoc =  {
            name:user.username,
            salutation:user.salutation,
            title:user.title,
            company:user.company,
            email:user.email,
            mobilephone:user.mobilephone, 
        }
        //新增潜在客户
      const a =  await leadsObj.insert(leadsDoc);
      console.log("=======>",a)
        


    }
}