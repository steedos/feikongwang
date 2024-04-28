const moment = require('moment');
module.exports = {
    handler: async function (leaveInfo, businessTripInfo, outInfo, workEnd) {
        // // 正常上班结束时间
        // const workEnd = this.generateDateTimeByDateAndTime(workDay, rule.work_end);
        var timeSlots = []; //请假、出差、外出 总时间段
        if (leaveInfo.totalMinites > 0) {
            timeSlots = timeSlots.concat(leaveInfo.duration);
        }
        if (businessTripInfo.totalMinites > 0) {
            timeSlots = timeSlots.concat(businessTripInfo.duration);
        }
        if (outInfo.totalMinites > 0) {
            timeSlots = timeSlots.concat(outInfo.duration);
        }
        // var workEndOfProcess = workEnd;
        var workEndOfProcess = null;
        if (timeSlots.length > 0) {
            let latestTimeObj = null;
            let latestTime = null;
            timeSlots.forEach(time => {  //找出最晚的流程（请假、外出、出差）的结束时间
                const end = moment(time.end);
                if (!latestTime || end.isAfter(latestTime)) {
                    latestTime = end;
                    latestTimeObj = time;
                }
            });
            console.log("最晚的流程结束时间段", latestTimeObj);
            if (latestTimeObj.end >= workEnd) {
                for (let timeSlot of timeSlots) {
                    if (latestTimeObj.start <= timeSlot.end && latestTimeObj.start >= timeSlot.start) {
                        latestTimeObj.start = timeSlot.start
                    }
                }
                workEndOfProcess = latestTimeObj.start
            }

        }


        return workEndOfProcess;
    }
}