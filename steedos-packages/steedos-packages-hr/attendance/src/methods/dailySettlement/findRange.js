//获取查询范围（请假、出差、外出、加班）
const moment = require('moment');
module.exports = {
    handler: async function (workDay) {
        const date = moment(workDay);
        const start = date.subtract(8, 'hours');
        const startISOString = start.toISOString();
        // 范围的开始时间
        const startDate = new Date(startISOString)
        var end = start.add(1, "day");
        const endISOString = end.toISOString();
        // 范围的结束时间
        const endDate = new Date(endISOString) 
        return {
            "startDate": startDate,
            "endDate": endDate
        }
    }
}