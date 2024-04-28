const moment = require('moment');
module.exports = {
    handler: async function (leaveInfo, businessTripInfo, outInfo,workStart) {
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
        //var workStartOfProcess = workStart;
        var workStartOfProcess = null;
        if (timeSlots.length > 0) {
            let latestTimeObj = null;
            let latestTime = null;
            timeSlots.forEach(time => {  //找出最早的流程（请假、外出、出差）的开始时间
                const start = moment(time.start);
                if (!latestTime || start.isBefore(latestTime)) {
                    latestTime = start;
                    latestTimeObj = time;
                }
            });
            console.log("最早的流程开始时间段", latestTimeObj);
            if (latestTimeObj.start <= workStart) {
                for (let timeSlot of timeSlots) {
                    if (latestTimeObj.end >= timeSlot.start && latestTimeObj.end <= timeSlot.end) {
                        latestTimeObj.end = timeSlot.end
                    }
                }
                workStartOfProcess = latestTimeObj.end;
            }

        }


        return workStartOfProcess;
    }
}