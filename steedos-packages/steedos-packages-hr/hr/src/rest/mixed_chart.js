
"use strict";
// @ts-check

const _ = require('lodash');

module.exports = {
    rest: {
        method: 'GET',
        fullPath: '/api/hr/mixed_chart'
    },
    async handler(ctx) {
        const userSession = ctx.meta.user;

        // 第一步：获取所有的部门
        const organizationsData = await this.getObject('organizations').find(
            {
                fields: ["_id", "fullname", "name", "sort_no"],
                //   filters: ['owner', '=', ctx.meta.user.userId],  
                sort: 'sort_no desc'
            },
            userSession
        );

        let xAxis_data_ids = [];
        let xAxis_data_labels = [];
        _.forEach(organizationsData,(i) => {
            xAxis_data_ids.push(i._id);
            xAxis_data_labels.push(i.name);
        });

        // 第二步：统计非离职（正式、试用）状态的各部门人数
        const employeeData = await this.getObject('hr_employee').find(
            {
                fields: ["_id","department"],
                filters: [['status','=',['trail','in']]],  
                sort: 'sort_no desc'
            },
            userSession
        );
        const departmentPeopleCounts = _.countBy(employeeData, 'department');

        const number_of_employees = _.map(xAxis_data_ids,(i)=>{
            const v = departmentPeopleCounts[i] || 0;
            return v;
        })

        // 当前日期
        const now = new Date();
        // 本年开始时间
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const startOfYearISO = startOfYear.toISOString(); // 格式化为ISO字符串
        // 本年结束时间
        const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        const endOfYearISO = endOfYear.toISOString(); // 格式化为ISO字符串

        // 第三步：统计当年 试用、正式 状态的各部门人数
        const validData = await this.getObject('hr_employee').find(
            {
                fields: ["_id","department","status"],
                filters: [['status','=',['trail','in']],["date", "between", [startOfYearISO, endOfYearISO]]],  
                sort: ''
            },
            userSession
        );

        const trailData = _.filter(validData, function(o) { return o.status === 'trail'; });
        const trailPeopleCounts = _.countBy(trailData, 'department');

        const inData = _.filter(validData, function(o) { return o.status === 'in'; });
        const inPeopleCounts = _.countBy(inData, 'department');

        const number_of_trial_users_this_year = _.map(xAxis_data_ids,(i)=>{
            const v = trailPeopleCounts[i] || 0;
            return v;
        })

        const official_number_of_people_this_year = _.map(xAxis_data_ids,(i)=>{
            const v = inPeopleCounts[i] || 0;
            return v;
        })

        // 第四步：离职日期在当年的各部门人数
        const outData = await this.getObject('hr_employee').find(
            {
                fields: ["_id","department"],
                filters: [['status','=','out'],["resign_date", "between", [startOfYearISO, endOfYearISO]]],  
                sort: ''
            },
            userSession
        );
        const outPeopleCounts = _.countBy(outData, 'department');

        const number_of_resignations_this_year = _.map(xAxis_data_ids,(i)=>{
            const v = outPeopleCounts[i] || 0;
            return v;
        })

        return {
            'status': 0,
            'msg': '',
            'data': {
                xAxis_data: xAxis_data_labels,
                number_of_employees,
                number_of_trial_users_this_year,
                official_number_of_people_this_year,
                number_of_resignations_this_year
            }
        }
    }
}