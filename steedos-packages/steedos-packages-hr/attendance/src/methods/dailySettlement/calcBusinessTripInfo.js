/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-19 10:20:26
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-08-21 17:40:07
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance/src/methods/dailySettlement/calcBusinessTripInfo.js
 * @Description: 计算出当天用户的所有出差信息
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
        var businessInformations = await broker.call('objectql.find', {   //查询该员工的出差信息
            objectName: "attendance_business_out",
            query: {
                filters: [
                    ['applicant', '=', userId],
                    ['instance_state', '=', 'approved'],
                    [[['start_time', '>=', workStart], ['end_time', '<=', workEnd]], //当内出差
                        "or",
                    [['start_time', '<', workStart], ["end_time", '>', workStart], ['end_time', '<=', workEnd]],//出差开始时间在当天之前，出差结束时间在当天内
                        "or",
                    [["start_time", '<', workStart], ['end_time', '>', workEnd]],//出差开始时间在当天之前，出差结束时间在当天之后
                        "or",
                    [["start_time", '>=', workStart], ["start_time", '<', workEnd]['end_time', '>', workEnd]],
                    ]

                ]
            }
        });
        var businessOutRef = []; //出差记录id
        var totalMinites = 0; //出差总时长
        var duration = []; //出差时间段
        if (!!businessInformations[0]) {
            for (var businessInformation of businessInformations) {
                var businessStart = new Date(businessInformation.start_time);
                var businessEnd = new Date(businessInformation.end_time);
                //当天出差
                if (businessStart >= workStart && businessEnd <= workEnd) {
                    //出差开始时间在上班开始时间之后，出差结束时间在午休开始时间之前
                    if (businessStart >= workStart && businessEnd <= restStart) {
                        totalMinites += businessEnd - businessStart;
                        console.log("出差时间1", totalMinites);
                        businessOutRef.push(businessInformation._id);
                        duration.push({ "start": businessStart, "end": businessEnd });
                        continue;
                    }
                    //出差开始时间在上班开始时间之后，出差结束时间在午休时间之内
                    if (businessStart >= workStart && businessEnd >= restStart && businessEnd <= restEnd) {
                        totalMinites += restStart - businessInformation.start
                        console.log("出差时间2", totalMinites);
                        businessOutRef.push(businessInformation._id);
                        duration.push({ "start": businessStart, "end": restStart });
                        continue;
                    }
                    //出差开始时间在上班开始时间之后，出差结束时间在午休时间之后
                    if (businessStart >= workStart && businessEnd >= restEnd && businessEnd <= workEnd) {
                        totalMinites += businessEnd - businessStart - (restEnd - restStart);
                        console.log("出差时间3", totalMinites);
                        businessOutRef.push(businessInformation._id);
                        duration.push({ "start": businessStart, "end": businessEnd });
                        continue;
                    }
                    // 出差开始时间在午休时间之内、出差结束时间在午休时间之后
                    if (businessStart > restStart && businessStart < restEnd && businessEnd > restEnd && businessEnd <= workEnd) {
                        totalMinites += businessEnd - restEnd;
                        console.log("出差时间4", totalMinites);
                        businessOutRef.push(businessInformation._id);
                        duration.push({ "start": restEnd, "end": businessEnd });
                        continue;
                    }
                    // 出差开始时间在午休之后、出差结束时间在午休之后
                    if (businessStart > restEnd && businessEnd > restEnd && businessEnd <= workEnd) {
                        totalMinites += businessEnd - businessStart;
                        console.log("出差时间5", totalMinites);
                        businessOutRef.push(businessInformation._id);
                        duration.push({ "start": businessStart, "end": businessEnd });
                        continue;
                    }
                }

                //出差开始时间在上班时间之前、出差结束时间在当天工作时间之内
                if (businessStart < workStart && businessEnd > workStart && businessEnd <= workEnd) {
                    //出差开始时间在当天工作时间之前，出差结束时间在午休开始时间之前
                    if (businessEnd > workStart && businessEnd <= restStart) {
                        totalMinites += businessEnd - workStart;
                        console.log("出差时间6", totalMinites);
                        businessOutRef.push(businessInformation._id);
                        duration.push({ "start": workStart, "end": businessEnd });
                        continue;
                    }
                    //出差开始时间在当天工作时间之前，出差结束时间在午休时间之内
                    if (businessEnd > restStart && businessEnd <= restEnd) {
                        totalMinites += restStart - workStart;
                        console.log("出差时间7", totalMinites);
                        businessOutRef.push(businessInformation._id);
                        duration.push({ "start": workStart, "end": restStart });
                        continue;
                    }
                    //出差开始时间在当天工作时间之前，出差结束时间在午休时间之后
                    if (businessEnd > restEnd && businessEnd <= workEnd) {
                        totalMinites += businessEnd - workStart - (restEnd - restStart);
                        console.log("出差时间8", totalMinites);
                        businessOutRef.push(businessInformation._id);
                        duration.push({ "start": workStart, "end": businessEnd });
                        continue;
                    }
                }
                // 出差开始时间在当天工作时间之前、出差结束时间在当天工作时间之后
                if (businessStart < workStart && businessEnd > workEnd) {
                    totalMinites += workEnd - workStart - (restEnd - restStart);
                    console.log("出差时间9", totalMinites);
                    businessOutRef.push(businessInformation._id);
                    duration.push({ "start": workStart, "end": workEnd });
                    continue;
                }
                // 出差开始时间在当天工作时间之内、出差结束时间在当天工作时间之后
                if (businessStart >= workStart && businessStart < workEnd && businessEnd > workEnd) {
                    //出差开始时间在上班开始时间之后，出差结束时间在当天工作时间之后
                    if (businessStart >= workStart && businessStart <= restStart) {
                        totalMinites += workEnd - businessStart - (restEnd - restStart)
                        console.log("出差时间10", totalMinites);
                        businessOutRef.push(businessInformation._id);
                        duration.push({ "start": businessStart, "end": workEnd });
                        continue;
                    }
                    //出差开始时间在午休之内，出差结束时间在当天工作时间之后
                    if (businessStart > restStart && businessStart <= restEnd) {
                        totalMinites += workEnd - restEnd
                        console.log("出差时间11", totalMinites);
                        businessOutRef.push(businessInformation._id);
                        duration.push({ "start": restEnd, "end": workEnd });
                        continue;
                    }
                    //出差开始时间在午休之后，出差结束时间在当天工作时间之后
                    if (businessStart > restEnd && businessStart <= workEnd) {
                        totalMinites += workEnd - businessStart
                        console.log("出差时间12", totalMinites);
                        businessOutRef.push(businessInformation._id);
                        duration.push({ "start": businessStart, "end": workEnd });
                        continue;
                    }
                }

            }
        } else {
            console.log("该员工没有出差记录");
        }
        totalMinites = await this.millisecondToMinites(totalMinites) //转为分钟
        return {
            ids: businessOutRef,
            totalMinites: totalMinites,  // 当天出差总时长，返回0表示没有出差
            duration: duration
        }
    }
}