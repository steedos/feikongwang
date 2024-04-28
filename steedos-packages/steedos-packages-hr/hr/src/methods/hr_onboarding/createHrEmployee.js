/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-14 15:41:05
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-14 18:12:49
 * @FilePath: /chinaums-oa-apps/steedos-packages/hr/src/methods/hr_onboarding/createHrEmployee.js
 * @Description: 将审批通过的入职申请单信息导入到花名册中
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
const moment = require('moment');
module.exports = {

    handler: async function (doc, userSession) {
        console.log("===========doc", doc)

        // 调用添加人员graphql
        const insertUser = `mutation{record: space_users__insert(doc: {
            email_notification:false,
            locale:"zh-cn",
            name:"${doc.name}",
            password_expired:false,
            sms_notification:false,
            user_accepted:true,
            zoom:"normal",
            owner:"${doc.owner}",
            locked:false,
            email:"${doc.email}",
            organizations:["${doc.department}"],
            profile:"user",
            mobile:"${doc.phone}",
            password:"123456"
            
        })
            {_id}
          }`
        console.log("======>", insertUser)
        const spaceUsers = await this.broker.call('api.graphql', {
            query: insertUser
        },
            {
                meta: {
                    user: userSession

                }
            }
        );
        let spaceUserId = spaceUsers.data.record._id
        const spaceUsersObj = this.getObject('space_users');
        const spaceDoc = await spaceUsersObj.findOne(spaceUserId);

        const joinedDate = moment(doc.date).utcOffset(8);
        const trialPeriod = doc.trial_period ? doc.trial_period : 0
        var probationTime = joinedDate.add(trialPeriod, 'months').format('YYYY-MM-DD');
        var newDate = moment().format('YYYY-MM-DD'); //获得当天日期
        probationTime = moment(probationTime);
        newDate = moment(newDate);
        var status = ""
        if (probationTime.isBefore(newDate)) {      //判断员工状态 trail:试用 、in:在职 
            status = "in"
        } else if (probationTime.isAfter(newDate)) {
            status = "trail"
        } else {
            status = "in"
        }
        console.log("员工状态", status)
        let hr_employee = {
            "name": doc.name,   //姓名
            "gender": doc.gender, //性别
            "number": doc.number,   //工号
            "identify": doc.identify, //身份证号
            "phone": doc.phone, //手机号
            "email": doc.email, //邮箱
            "status": status, //员工状态
            "position_status": doc.position_status, //员工类型
            "company": doc.company, //所属公司
            "department": doc.department, //所属部门
            "manager": doc.manager, //上级领导
            "job_title": doc.job_title, //职位
            "date": doc.date, //入职日期
            "venue": doc.venue, //办公地点
            "trial_period": doc.trial_period, //试用期（月）
            "regularization_date": doc.regularization_date, //预计转正日期
            "birth": doc.birth, //出生日期
            "marrige": doc.marrige, //婚姻状况
            "political": doc.political, //政治面貌
            "first_participation": doc.first_participation, //首次参加工作时间
            "address": doc.address, //现居住地址
            "social_security_account": doc.social_security_account, //社保账号
            "cpf_account": doc.cpf_account, //公积金账号
            "owner": spaceDoc.user,
            "space": doc.space,
            "account": spaceDoc.user
        }
        await this.broker.call(
            'objectql.insert',
            {
                objectName: 'hr_employee',
                doc: hr_employee
            },
        );




    }
}