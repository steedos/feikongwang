const moment = require('moment');
module.exports = {
    handler: async function (today) {
        const currentDate = moment(today).format('YYYY-MM-DD');
        const newTime = new Date(currentDate);
        //查询节假日
        const ifIsDeploymentWorkday = await this.broker.call(
            'objectql.find',
            {
                objectName: 'holidays',
                query: {
                    filters: ["date", "=", newTime],
                },
            },
        );
        console.log("节假日", ifIsDeploymentWorkday)
        console.log("今天星期", moment(today).isoWeekday())
        var ifClockIn = false;
        let description;
        if (!!ifIsDeploymentWorkday[0]) { //判断当日在节假日是否有数据
            if (ifIsDeploymentWorkday[0].type == "adjusted_working_day") {   //判断当日是否是调配工作日
                console.log("调配工作日")
                ifClockIn = true;
            } else {
                description = '未在打卡时间范围'
            }
        } else if (moment(today).isoWeekday() >= 1 && moment(today).isoWeekday() <= 5) { //判断当日是否是星期一到星期五的某一天
             ifClockIn = true;
        }
        return { ifClockIn, description }
    }
}