const moment = require('moment');
module.exports = {
    /**
      计算一天之内的分钟差
     */
    handler: async function (startDate, endDate) {
            const startTime = moment(startDate, 'HH:mm');
            const endTime = moment(endDate, 'HH:mm');
            const duration = moment.duration(endTime.diff(startTime));
            return  duration.asMinutes();
    }
}