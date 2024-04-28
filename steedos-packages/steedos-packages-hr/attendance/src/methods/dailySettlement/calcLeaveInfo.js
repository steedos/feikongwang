/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-19 10:20:26
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-08-21 17:40:18
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance/src/methods/dailySettlement/calcLeaveInfo.js
 * @Description: 计算出当天用户的所有请假信息
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
        // 正常上班开始时间
        const workStart = this.generateDateTimeByDateAndTime(workDay, rule.work_start)
        // 正常上班结束时间
        const workEnd = this.generateDateTimeByDateAndTime(workDay, rule.work_end)
        // 午休开始时间
        const restStart = this.generateDateTimeByDateAndTime(workDay, rule.rest_start)
        // 午休结束时间
        const restEnd = this.generateDateTimeByDateAndTime(workDay, rule.rest_end)
        // 获取查询范围
        const findRange = await this.findRange(workDay);
        //查询该员工的请假信息
        var leaveInformations = await broker.call('objectql.find', {
            objectName: "attendance_leave",
            query: {
                filters: [
                    ['staff', '=', userId],
                    ['instance_state', '=', 'approved'],
                    [
                        [['start', '>=', workStart], ['end', '<=', workEnd]], //当内请假
                        "or",
                        [['start', '<', workStart], ["end", '>', workStart], ['end', '<=', workEnd]],//请假开始时间在当天之前，请假结束时间在当天内
                        "or",
                        [["start", '<', workStart], ['end', '>', workEnd]],//请假开始时间在当天之前，请假结束时间在当天之后
                        "or",
                        [["start", '>=', workStart], ["start", '<', workEnd]['end', '>', workEnd]],
                    ]
                ]
            }
        });
        var leaveOutRef = []; //请假记录id
        var totalMinites = 0; //请假总时长
        var duration = [];
        if (!!leaveInformations[0]) {
            for (var leaveInformation of leaveInformations) {
                var leaveStart = new Date(leaveInformation.start);
                var leaveEnd = new Date(leaveInformation.end);
                //当天请假
                if (leaveStart >= workStart && leaveEnd <= workEnd) {
                    //请假开始时间在上班开始时间之后，请假结束时间在午休开始时间之前
                    if (leaveStart >= workStart && leaveEnd <= restStart) {
                        totalMinites += leaveEnd - leaveStart;
                        console.log("请假时间1", totalMinites);
                        leaveOutRef.push(leaveInformation._id);
                        duration.push({ "start": leaveStart, "end": leaveEnd });
                        continue;
                    }
                    //请假开始时间在上班开始时间之后，请假结束时间在午休时间之内
                    if (leaveStart >= workStart && leaveEnd >= restStart && leaveEnd <= restEnd) {
                        totalMinites += restStart - leaveStart
                        console.log("请假时间2", totalMinites);
                        leaveOutRef.push(leaveInformation._id);
                        duration.push({ "start": leaveStart, "end": restStart });
                        continue;
                    }
                    //请假开始时间在上班开始时间之后，请假结束时间在午休时间之后
                    if (leaveStart >= workStart && leaveEnd >= restEnd && leaveEnd <= workEnd) {
                        totalMinites += leaveEnd - leaveStart - (restEnd - restStart);
                        console.log("请假时间3", totalMinites);
                        leaveOutRef.push(leaveInformation._id);
                        duration.push({ "start": leaveStart, "end": leaveEnd });
                        continue;
                    }
                    // 请假开始时间在午休时间之内、请假结束时间在午休时间之后
                    if (leaveStart > restStart && leaveStart < restEnd && leaveEnd > restEnd && leaveEnd <= workEnd) {
                        totalMinites += leaveEnd - restEnd;
                        console.log("请假时间4", totalMinites);
                        leaveOutRef.push(leaveInformation._id);
                        duration.push({ "start": restEnd, "end": leaveEnd });
                        continue;
                    }
                    // 请假开始时间在午休之后、请假结束时间在午休之后
                    if (leaveStart > restEnd && leaveEnd > restEnd && leaveEnd <= workEnd) {
                        totalMinites += leaveEnd - leaveStart;
                        console.log("请假时间5", totalMinites);
                        leaveOutRef.push(leaveInformation._id);
                        duration.push({ "start": leaveStart, "end": leaveEnd });
                        continue;
                    }
                }

                //请假开始时间在上班时间之前、请假结束时间在当天工作时间之内
                if (leaveStart < workStart && leaveEnd > workStart && leaveEnd <= workEnd) {
                    //请假开始时间在当天工作时间之前，请假结束时间在午休开始时间之前
                    if (leaveEnd > workStart && leaveEnd <= restStart) {
                        totalMinites += leaveEnd - workStart;
                        console.log("请假时间6", totalMinites);
                        leaveOutRef.push(leaveInformation._id);
                        duration.push({ "start": workStart, "end": leaveEnd });
                        continue;
                    }
                    //请假开始时间在当天工作时间之前，请假结束时间在午休时间之内
                    if (leaveEnd > restStart && leaveEnd <= restEnd) {
                        totalMinites += restStart - workStart;
                        console.log("请假时间7", totalMinites);
                        leaveOutRef.push(leaveInformation._id);
                        duration.push({ "start": workStart, "end": restStart });
                        continue;
                    }
                    //请假开始时间在当天工作时间之前，请假结束时间在午休时间之后
                    if (leaveEnd > restEnd && leaveEnd <= workEnd) {
                        totalMinites += leaveEnd - workStart - (restEnd - restStart);
                        console.log("请假时间8", totalMinites);
                        leaveOutRef.push(leaveInformation._id);
                        duration.push({ "start": workStart, "end": leaveEnd });
                        continue;
                    }
                }
                // 请假开始时间在当天工作时间之前、请假结束时间在当天工作时间之后
                if (leaveStart < workStart && leaveEnd > workEnd) {
                    totalMinites += workEnd - workStart - (restEnd - restStart);
                    console.log("请假时间9", totalMinites);
                    leaveOutRef.push(leaveInformation._id);
                    duration.push({ "start": workStart, "end": workEnd });
                    continue;
                }
                // 请假开始时间在当天工作时间之内、请假结束时间在当天工作时间之后
                if (leaveStart >= workStart && leaveStart < workEnd && leaveEnd > workEnd) {
                    //请假开始时间在上班开始时间之后，请假结束时间在当天工作时间之后
                    if (leaveStart >= workStart && leaveStart <= restStart) {
                        totalMinites += workEnd - leaveStart - (restEnd - restStart)
                        console.log("请假时间10", totalMinites);
                        leaveOutRef.push(leaveInformation._id);
                        duration.push({ "start": leaveStart, "end": workEnd });
                        continue;
                    }
                    //请假开始时间在午休之内，请假结束时间在当天工作时间之后
                    if (leaveStart > restStart && leaveStart <= restEnd) {
                        totalMinites += workEnd - restEnd
                        console.log("请假时间11", totalMinites);
                        leaveOutRef.push(leaveInformation._id);
                        duration.push({ "start": restEnd, "end": workEnd });
                        continue;
                    }
                    //请假开始时间在午休之后，请假结束时间在当天工作时间之后
                    if (leaveStart > restEnd && leaveStart <= workEnd) {
                        totalMinites += workEnd - leaveStart
                        console.log("请假时间12", totalMinites);
                        leaveOutRef.push(leaveInformation._id);
                        duration.push({ "start": leaveStart, "end": workEnd });
                        continue;
                    }
                }
            }
        } else {
            console.log("该员工没有请假记录")
        }
        totalMinites = await this.millisecondToMinites(totalMinites) //转为分钟
        return {
            ids: leaveOutRef,
            totalMinites: totalMinites,  // 当天请假总时长，返回0表示没有请假
            duration: duration

        }
    }
}