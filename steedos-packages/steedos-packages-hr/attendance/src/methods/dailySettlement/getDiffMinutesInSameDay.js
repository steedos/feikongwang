const moment = require('moment');
module.exports = {
    /**
     * 比较两个日期在同一天的分钟差，忽略年月日， 如 2020-08-03 11:00:00 和 2021-08-04 10:00:00 的分钟差为 60，反之为 -60
     * @param {date} date1 
     * @param {date} date2 
     */
    handler: async function (date1, date2) {
        const newDate1 = moment('1970-01-01' + ' ' + moment(date1).format('HH:mm:00'));
        const newDate2 = moment('1970-01-01' + ' ' + moment(date2).format('HH:mm:00'));
        return newDate1.diff(newDate2, 'minutes');
    }
}