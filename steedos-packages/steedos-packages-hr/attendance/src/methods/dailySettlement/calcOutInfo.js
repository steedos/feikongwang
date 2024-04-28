/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-19 10:20:26
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-08-21 17:40:23
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance/src/methods/dailySettlement/calcOutInfo.js
 * @Description: 计算出当天用户的所有外出信息
 */
module.exports = {
    /**
    return
    {

    }
     */
    handler: async function (userId, workDay, {
        attendanceInfo, // 用户考勤信息，{ start: 实际上班打卡时间, end }
        rule, // 考勤规则
        ctx
    }) {
        // 获取查询范围
        const findRange = await this.findRange(workDay);
        // 正常上班开始时间
        const workStart = this.generateDateTimeByDateAndTime(workDay, rule.work_start);
        // 正常上班结束时间
        const workEnd = this.generateDateTimeByDateAndTime(workDay, rule.work_end);
        // 午休开始时间
        const restStart = this.generateDateTimeByDateAndTime(workDay, rule.rest_start);
        // 午休结束时间
        const restEnd = this.generateDateTimeByDateAndTime(workDay, rule.rest_end);
        var goingOutInformations = await broker.call('objectql.find', {
            objectName: "attendance_going_out",
            query: {
                filters: [
                    ['applicant', '=', userId],
                    ['instance_state', '=', 'approved'],
                    [[['start_time', '>=', workStart], ['end_time', '<=', workEnd]], //当内外出
                        "or",
                    [['start_time', '<', workStart], ["end_time", '>', workStart], ['end_time', '<=', workEnd]],//外出开始时间在当天之前，外出结束时间在当天内
                        "or",
                    [["start_time", '<', workStart], ['end_time', '>', workEnd]],//外出开始时间在当天之前，外出结束时间在当天之后
                        "or",
                    [["start_time", '>=', workStart], ["start_time", '<', workEnd]['end_time', '>', workEnd]],
                    ]
                ]
            }
        });

        var goingOutRef = []; //外出记录id
        var totalMinites = 0; //外出总时长
        var duration = [];
        if (!!goingOutInformations[0]) {
            for (var goingOutInformation of goingOutInformations) {
                var goingOutStart = new Date(goingOutInformation.start_time);
                var goingOutEnd = new Date(goingOutInformation.end_time);
                //当天外出
                if (goingOutStart >= workStart && goingOutEnd <= workEnd) {
                    //外出开始时间在上班开始时间之后，外出结束时间在午休开始时间之前
                    if (goingOutStart >= workStart && goingOutEnd <= restStart) {
                        totalMinites += goingOutEnd - goingOutStart;
                        console.log("外出时间1", totalMinites);
                        goingOutRef.push(goingOutInformation._id);
                        duration.push({ "start": goingOutStart, "end": goingOutEnd });
                        continue;
                    }
                    //外出开始时间在上班开始时间之后，外出结束时间在午休时间之内
                    if (goingOutStart >= workStart && goingOutEnd >= restStart && goingOutEnd <= restEnd) {
                        totalMinites += restStart - goingOutInformation.start
                        console.log("外出时间2", totalMinites);
                        goingOutRef.push(goingOutInformation._id);
                        duration.push({ "start": goingOutInformation.start, "end": restStart });
                        continue;
                    }
                    //外出开始时间在上班开始时间之后，外出结束时间在午休时间之后
                    if (goingOutStart >= workStart && goingOutEnd >= restEnd && goingOutEnd <= workEnd) {
                        totalMinites += goingOutEnd - goingOutStart - (restEnd - restStart);
                        console.log("外出时间3", totalMinites);
                        goingOutRef.push(goingOutInformation._id);
                        duration.push({ "start": goingOutInformation.start, "end": goingOutEnd });
                        continue;
                    }
                    // 外出开始时间在午休时间之内、外出结束时间在午休时间之后
                    if (goingOutStart > restStart && goingOutStart < restEnd && goingOutEnd > restEnd && goingOutEnd <= workEnd) {
                        totalMinites += goingOutEnd - restEnd;
                        console.log("外出时间4", totalMinites);
                        goingOutRef.push(goingOutInformation._id);
                        duration.push({ "start": restEnd, "end": goingOutEnd });
                        continue;
                    }
                    // 外出开始时间在午休之后、外出结束时间在午休之后
                    if (goingOutStart > restEnd && goingOutEnd > restEnd && goingOutEnd <= workEnd) {
                        totalMinites += goingOutEnd - goingOutStart;
                        console.log("外出时间5", totalMinites);
                        goingOutRef.push(goingOutInformation._id);
                        duration.push({ "start": goingOutStart, "end": goingOutEnd });
                        continue;
                    }
                }

                //外出开始时间在上班时间之前、外出结束时间在当天工作时间之内
                if (goingOutStart < workStart && goingOutEnd > workStart && goingOutEnd <= workEnd) {
                    //外出开始时间在当天工作时间之前，外出结束时间在午休开始时间之前
                    if (goingOutEnd > workStart && goingOutEnd <= restStart) {
                        totalMinites += goingOutEnd - workStart;
                        console.log("外出时间6", totalMinites);
                        goingOutRef.push(goingOutInformation._id);
                        duration.push({ "start": workStart, "end": goingOutEnd });
                        continue;
                    }
                    //外出开始时间在当天工作时间之前，外出结束时间在午休时间之内
                    if (goingOutEnd > restStart && goingOutEnd <= restEnd) {
                        totalMinites += restStart - workStart;
                        console.log("外出时间7", totalMinites);
                        goingOutRef.push(goingOutInformation._id);
                        duration.push({ "start": workStart, "end": restStart });
                        continue;
                    }
                    //外出开始时间在当天工作时间之前，外出结束时间在午休时间之后
                    if (goingOutEnd > restEnd && goingOutEnd <= workEnd) {
                        totalMinites += goingOutEnd - workStart - (restEnd - restStart);
                        console.log("外出时间8", totalMinites);
                        goingOutRef.push(goingOutInformation._id);
                        duration.push({ "start": workStart, "end": goingOutEnd });
                        continue;
                    }
                }
                // 外出开始时间在当天工作时间之前、外出结束时间在当天工作时间之后
                if (goingOutStart < workStart && goingOutEnd > workEnd) {
                    totalMinites += workEnd - workStart - (restEnd - restStart);
                    console.log("外出时间9", totalMinites);
                    goingOutRef.push(goingOutInformation._id);
                    duration.push({ "start": workStart, "end": workEnd });
                    continue;
                }
                // 外出开始时间在当天工作时间之内、外出结束时间在当天工作时间之后
                if (goingOutStart >= workStart && goingOutStart < workEnd && goingOutEnd > workEnd) {
                    //外出开始时间在上班开始时间之后，外出结束时间在当天工作时间之后
                    if (goingOutStart >= workStart && goingOutStart <= restStart) {
                        totalMinites += workEnd - goingOutStart - (restEnd - restStart)
                        console.log("外出时间10", totalMinites);
                        goingOutRef.push(goingOutInformation._id);
                        duration.push({ "start": goingOutStart, "end": workEnd });
                        continue;
                    }
                    //外出开始时间在午休之内，外出结束时间在当天工作时间之后
                    if (goingOutStart > restStart && goingOutStart <= restEnd) {
                        totalMinites += workEnd - restEnd
                        console.log("外出时间11", totalMinites);
                        goingOutRef.push(goingOutInformation._id);
                        duration.push({ "start": restEnd, "end": workEnd });
                        continue;
                    }
                    //外出开始时间在午休之后，外出结束时间在当天工作时间之后
                    if (goingOutStart > restEnd && goingOutStart <= workEnd) {
                        totalMinites += workEnd - goingOutStart
                        console.log("外出时间12", totalMinites);
                        goingOutRef.push(goingOutInformation._id);
                        duration.push({ "start": goingOutInformation.start, "end": workEnd });
                        continue;
                    }
                }
            }
        } else {
            console.log("该员工没有外出记录")
        }
        totalMinites = await this.millisecondToMinites(totalMinites) //转为分钟
        return {
            ids: goingOutRef,
            totalMinites: totalMinites,  // 当天外出总时长，返回0表示没有外出
            duration: duration
        }
    }
}