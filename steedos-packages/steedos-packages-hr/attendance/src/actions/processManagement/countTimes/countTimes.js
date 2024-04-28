// 计算请假时长
const moment = require('moment');
module.exports = {
    rest: {
        method: 'GET',
        fullPath: '/api/countTimes',
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
        processDoc.start = new Date(processDoc.start);
        processDoc.end = new Date(processDoc.end);
        // 查询考勤规则
        const queryAttendanceRules = await this.queryAttendanceRules(processDoc.staff);  //获取该员工下的考勤规则
        const dateList = this.getLeaveDateList(processDoc.start, processDoc.end);
        var totalMinites = 0;
        if (queryAttendanceRules) {
            // 判断是否跨天
            const diffDays = moment(processDoc.end).diff(moment(processDoc.start), 'days');
            if (diffDays > 0) {
                for (let i = 0; i <= diffDays; i++) {
                    const currentDate = new Date(dateList[i]);
                    // 判断是否存在周六、周天
                    const data = await this.IfneedSettlement(currentDate);
                    if(!data.ifClockIn){
                        continue;
                    }
                    const currentWorkStart = this.generateDateTimeByDateAndTime(currentDate, queryAttendanceRules.work_start);
                    const currentWorkEnd = this.generateDateTimeByDateAndTime(currentDate, queryAttendanceRules.work_end);
                    const currentRestStart = this.generateDateTimeByDateAndTime(currentDate, queryAttendanceRules.rest_start);
                    const currentRestEnd = this.generateDateTimeByDateAndTime(currentDate, queryAttendanceRules.rest_end);
                    // 处理每一天的请假时间
                    if (processDoc.end >= currentWorkEnd) {
                        if (processDoc.start < currentWorkStart) {
                            // 请假开始时间在上班开始时间之前
                            totalMinites += (queryAttendanceRules.daily_hours) * 60 * 60 * 1000
                        } else if (processDoc.start >= currentWorkStart && processDoc.start <= currentRestStart) {
                            // 请假开始时间在上班开始时间和午休开始时间之间
                            totalMinites += currentWorkEnd - processDoc.start - (currentRestEnd - currentRestStart)
                        } else if (processDoc.start > currentRestStart && processDoc.start < currentRestEnd) {
                            // 请假开始时间午休时间之间
                            totalMinites += currentWorkEnd - currentRestEnd
                        } else if (processDoc.start >= currentRestEnd && processDoc.start <= currentWorkEnd) {
                            // 请假开始时间在午休时间之后
                            totalMinites += currentWorkEnd - processDoc.start
                        }
                    } else if (processDoc.end < currentWorkEnd) {
                        if (processDoc.end <= currentRestStart) {
                            // 请假时间在上班开始时间和午休开始时间之间
                            totalMinites += processDoc.end - currentWorkStart;
                        } else if (processDoc.end >= currentRestStart && processDoc.end <= currentRestEnd) {
                            // 请假时间在上班开始时间和午休时间之间
                            totalMinites += currentRestStart - currentWorkStart;
                        } else if (processDoc.end > currentRestEnd && processDoc.end <= currentWorkEnd) {
                            // 请假时间在午休时间之后
                            totalMinites += processDoc.end - currentWorkStart - (currentRestEnd - currentRestStart);
                        } else {
                            totalMinites += (queryAttendanceRules.daily_hours) * 60 * 60 * 1000
                        }
                    }
                }
            } else {
                const today = new Date(dateList[0]);
                console.log(">>>>today", today)
                // 正常上班开始时间
                const workStart = this.generateDateTimeByDateAndTime(today, queryAttendanceRules.work_start);
                console.log("正常上班开始时间", workStart)
                // 正常上班结束时间
                const workEnd = this.generateDateTimeByDateAndTime(today, queryAttendanceRules.work_end);

                // 午休开始时间
                const restStart = this.generateDateTimeByDateAndTime(today, queryAttendanceRules.rest_start);

                // 午休结束时间
                const restEnd = this.generateDateTimeByDateAndTime(today, queryAttendanceRules.rest_end);
                //当天请假
                if (processDoc.start >= workStart && processDoc.end <= workEnd) {
                    //请假开始时间在上班开始时间之后，请假结束时间在午休开始时间之前
                    if (processDoc.start >= workStart && processDoc.end < restStart) {
                        totalMinites += processDoc.end - processDoc.start;
                        console.log("请假时间1", totalMinites);
                    }

                    //请假开始时间在上班开始时间之后，请假结束时间在午休时间之内
                    if (processDoc.start >= workStart && processDoc.end >= restStart && processDoc.end <= restEnd) {
                        totalMinites += restStart - processDoc.start
                        console.log("请假时间2", totalMinites);
                    }
                    //请假开始时间在上班开始时间之后，请假结束时间在午休时间之后
                    if (processDoc.start >= workStart && processDoc.end > restEnd && processDoc.end <= workEnd) {
                        totalMinites += processDoc.end - processDoc.start - (restEnd - restStart);
                        console.log("请假时间3", totalMinites);
                    }

                    // 请假开始时间在午休时间之内、请假结束时间在午休时间之后
                    if (processDoc.start > restStart && processDoc.start < restEnd && processDoc.end > restEnd && processDoc.end <= workEnd) {
                        totalMinites += processDoc.end - restEnd;
                        console.log("请假时间4", totalMinites);
                    }

                    // 请假开始时间在午休之后、请假结束时间在午休之后
                    if (processDoc.start > restEnd && processDoc.end > restEnd && processDoc.end <= workEnd) {
                        totalMinites += processDoc.end - processDoc.start;
                        console.log("请假时间5", totalMinites);
                    }

                }

                //请假开始时间在上班时间之前、请假结束时间在当天工作时间之内
                if (processDoc.start < workStart && processDoc.end > workStart && processDoc.end <= workEnd) {
                    //请假开始时间在当天工作时间之前，请假结束时间在午休开始时间之前
                    if (processDoc.end > workStart && processDoc.end <= restStart) {
                        totalMinites += processDoc.end - workStart;
                        console.log("请假时间6", totalMinites);
                    }

                    //请假开始时间在当天工作时间之前，请假结束时间在午休时间之内
                    if (processDoc.end > restStart && processDoc.end <= restEnd) {
                        totalMinites += restStart - workStart;
                        console.log("请假时间7", totalMinites);
                    }

                    //请假开始时间在当天工作时间之前，请假结束时间在午休时间之后
                    if (processDoc.end > restEnd && processDoc.end <= workEnd) {
                        totalMinites += processDoc.end - workStart - (restEnd - restStart);
                        console.log("请假时间8", totalMinites);
                    }

                }

                // 请假开始时间在当天工作时间之前、请假结束时间在当天工作时间之后
                if (processDoc.start < workStart && processDoc.end > workEnd) {
                    totalMinites += workEnd - workStart - (restEnd - restStart);
                    console.log("请假时间9", totalMinites);
                }

                // 请假开始时间在当天工作时间之内、请假结束时间在当天工作时间之后
                if (processDoc.start >= workStart && processDoc.start < workEnd && processDoc.end > workEnd) {
                    //请假开始时间在上班开始时间之后，请假结束时间在当天工作时间之后
                    if (processDoc.start >= workStart && processDoc.start <= restStart) {
                        totalMinites += workEnd - processDoc.start - (restEnd - restStart)
                        console.log("请假时间10", totalMinites);
                    }

                    //请假开始时间在午休之内，请假结束时间在当天工作时间之后
                    if (processDoc.start > restStart && processDoc.start <= restEnd) {
                        totalMinites += workEnd - restEnd
                        console.log("请假时间11", totalMinites);
                    }
                    //请假开始时间在午休之后，请假结束时间在当天工作时间之后
                    if (processDoc.start > restEnd && processDoc.start <= workEnd) {
                        totalMinites += workEnd - processDoc.start
                        console.log("请假时间12", totalMinites);
                    }

                }
            }


        }
        totalMinites = await this.millisecondToMinites(totalMinites) //转为分钟
        console.log(">>>>请假时长", totalMinites / 60)

        return {
            "status": 0,
            "msg": "",
            "data": {
                "totalMinites": totalMinites,
            }
        };

    }
}