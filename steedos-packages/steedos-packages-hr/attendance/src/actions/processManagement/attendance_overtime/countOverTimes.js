/**
 * 计算加班时长
 *  加班时间是否跨天？
 *  判断是否是工作日或者调配工作日加班
 *   是：加班时长 为工作日之外的时间
 *   否：全天加班（午休时间除外）
 */
const moment = require('moment');
module.exports = {
    rest: {
        method: 'GET',
        fullPath: '/api/countOverTimes',
        authorization: false,
        authentication: false
    },
    params: {
        processDoc: {
            type: 'object',
            optional: true
        },

    },

    handler: async function (ctx) {
        const { processDoc } = ctx.params;
        var processStart = new Date(processDoc.start)
        var processEnd = new Date(processDoc.end)
        // 查询考勤规则
        const queryAttendanceRules = await this.queryAttendanceRules(processDoc.staff);  //获取该员工下的考勤规则
        const dateList = this.getLeaveDateList(processStart,processEnd );
        var overTimesSum = 0;
        if (queryAttendanceRules) {
            // 判断是否跨天
            const aend = moment(processDoc.end).utcOffset(8).format('YYYY-MM-DD')
            console.log("aend", aend);
            const astart = moment(processDoc.start).utcOffset(8).format('YYYY-MM-DD')
            console.log(astart)
            const diffDays = new Date(aend).getDate() - new Date(astart).getDate()
            // 加班总时长（包含了休息时间）
            overTimesSum = (processDoc.end - processDoc.start) / (60 * 1000 * 60)
            if (diffDays > 0) {
                for (let i = 0; i <= diffDays; i++) {
                    const currentDate = new Date(dateList[i]);
                    const attendanceDate = moment(currentDate).utcOffset(8).format('YYYY-MM-DD')
                    // 判断是否是工作日或者调配工作日
                    const needSettlement = await this.IfneedSettlement(attendanceDate);

                    const currentWorkStart = this.generateDateTimeByDateAndTime(currentDate, queryAttendanceRules.work_start);
                    const currentWorkEnd = this.generateDateTimeByDateAndTime(currentDate, queryAttendanceRules.work_end);
                    const currentRestStart = this.generateDateTimeByDateAndTime(currentDate, queryAttendanceRules.rest_start);
                    const currentRestEnd = this.generateDateTimeByDateAndTime(currentDate, queryAttendanceRules.rest_end);


                    if (needSettlement.ifClockIn) {
                        // 工作日或者调配工作日
                        if (processDoc.end >= currentWorkEnd) {
                            if (processDoc.start < currentWorkEnd) {
                                overTimesSum -= (currentWorkEnd - processDoc.start) / (60 * 1000 * 60)
                            }
                        } else if (processDoc.end > currentWorkStart) {
                            overTimesSum -= (processDoc.end - currentWorkStart) / (60 * 1000 * 60)
                        }

                    } else {
                        // 休息日加班
                        if (processDoc.start > currentRestStart && processDoc.start < currentRestEnd) {
                            overTimesSum -= (currentRestEnd - processDoc.start) / (60 * 1000 * 60)
                        }
                        if (processDoc.end > currentRestStart && processDoc.end < currentRestEnd) {
                            overTimesSum -= (processDoc.end - currentRestStart) / (60 * 1000 * 60)
                        }
                        if (processDoc.end >= currentRestEnd) {
                            overTimesSum -= (currentRestEnd - currentRestStart) / (60 * 1000 * 60)
                        }
                    }
                }
            } else if (diffDays == 0) {
                //加班时间不跨天
                const today = new Date(dateList[0]);
                const attendanceDate = moment(today).utcOffset(8).format('YYYY-MM-DD')
                // 判断是否是工作日或者调配工作日
                const needSettlement = await this.IfneedSettlement(attendanceDate);
                // 正常上班开始时间
                const workStart = this.generateDateTimeByDateAndTime(today, queryAttendanceRules.work_start);
                console.log("正常上班开始时间", workStart)
                // 正常上班结束时间
                const workEnd = this.generateDateTimeByDateAndTime(today, queryAttendanceRules.work_end);

                // 午休开始时间
                const restStart = this.generateDateTimeByDateAndTime(today, queryAttendanceRules.rest_start);

                // 午休结束时间
                const restEnd = this.generateDateTimeByDateAndTime(today, queryAttendanceRules.rest_end);
                if (needSettlement.ifClockIn) {
                    //是工作日或者调配工作日
                    if(processDoc.start>=workStart && processDoc.end<=workEnd){
                        overTimesSum = 0;
                    } else if(processDoc.start>=workStart && processDoc.end>workEnd){
                        // 加班开始时间大于等于上班开始时间，加班结束大于上班结束时间
                        overTimesSum -= (workEnd - processDoc.start)/(60*1000*60)
                    }
                }else{
                    //休息日加班
                    if(processDoc.start<=restStart && processDoc.end<=restEnd){
                        // 加班开始时间小于等于午休开始时间，加班结束时间小于等于午休结束时间
                        overTimesSum -= (processDoc.end - restStart)/(60*1000*60)
                    }else if(processDoc.start>restStart && processDoc.end<restEnd){
                          // 加班开始时间大于等于午休开始时间，加班结束时间小于午休结束时间
                        overTimesSum -= (processDoc.end - processDoc.start)/(60*1000*60)
                    }else if(processDoc.start>=restStart && processDoc.end>restEnd){
                        // 加班开始时间大于等于午休开始时间，加班结束时间大于午休结束时间
                        overTimesSum -= (restEnd - processDoc.start)/(60*1000*60)
                    }else if(processDoc.start<=restStart && processDoc.end>=workEnd){
                          // 加班开始时间小于等于午休开始时间，加班结束时间大于等于上班结束时间
                        overTimesSum -= (restEnd-restStart)/(60*1000*60)
                    }
                }
            }


        }
        // overTimesSum = await this.millisecondToMinites(overTimesSum) //转为分钟
        console.log(">>>>加班时长", overTimesSum)

        return {
            "status": 0,
            "msg": "",
            "data": {
                "totalMinites": overTimesSum,
            }
        };

    }
}