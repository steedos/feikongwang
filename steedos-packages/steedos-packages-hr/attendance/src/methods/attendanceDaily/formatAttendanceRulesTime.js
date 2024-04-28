//考勤规则时间格式化
const moment = require('moment');
module.exports = {
    handler: async function (AttendanceRulesTime) {
        const time = moment(AttendanceRulesTime).utcOffset(0).format('HH:mm:00');
        return time;
    }
}