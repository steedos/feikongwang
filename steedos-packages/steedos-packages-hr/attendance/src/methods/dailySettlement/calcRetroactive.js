/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-19 10:20:26
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-08-21 17:40:07
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance/src/methods/dailySettlement/calcBusinessTripInfo.js
 * @Description: 计算出当天用户的所有补卡信息
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
        // 上班开始打卡时间
        const begins_work_clock = this.generateDateTimeByDateAndTime(workDay, rule.begins_work_clock)
        // 下班开始打卡时间
        const begins_quit_clock = this.generateDateTimeByDateAndTime(workDay, rule.begins_quit_clock)
        // 上班结束打卡时间
        const end_work_clock = this.generateDateTimeByDateAndTime(workDay, rule.end_work_clock);
        // 下班结束打卡时间
        const end_quit_clock = this.generateDateTimeByDateAndTime(workDay, rule.end_quit_clock);
        var retroactiveInformations = await broker.call('objectql.find', {   //查询该员工的出差信息
            objectName: "attendance_retroactive",
            query: {
                filters: [
                    ['staff', '=', userId],
                    ['instance_state', '=', 'approved'],
                    [
                        [['start', '>=', begins_work_clock], ['start', '<=', end_work_clock]],
                        "or",
                        [['end', '>=', begins_quit_clock], ['end', '<=', end_quit_clock]]
                    ]


                ]
            }
        });
        var retroactiveRef = []; //补卡记录id
        var retroactiveWork = false; //默认不补上班卡
        var retroactiveQuit = false //默认不补下班卡
        if (!!retroactiveInformations[0]) {
            for (var retroactiveInformation of retroactiveInformations) {
                if(retroactiveInformation.type=="work"){
                    retroactiveWork = true;
                    retroactiveRef.push(retroactiveInformation._id);
                }
                if(retroactiveInformation.type=="quit"){
                    retroactiveQuit = true;
                    retroactiveRef.push(retroactiveInformation._id);
                }

            }
        } else {
            console.log("该员工没有补卡记录");
        }
        return {
            ids: retroactiveRef,
            retroactiveWork: retroactiveWork,  
            retroactiveQuit: retroactiveQuit
        }
    }
}