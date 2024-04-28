/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-06 15:30:43
 * @LastEditors: 高红新 gaohongxin@steedos.com
 * @LastEditTime: 2023-08-12 17:50:53
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance/src/methods/dailySettlement/getUserStartAndEndWorkTime.js
 * @Description: 上班开始时间考虑请假、出差、外出非整天的情况（如上半天、下半天），每个人不一样， 如A用户请假，上班开始时间为请假结束时间/下班结束时间为请假开始时间
 */

module.exports = {
    /**
     *
     * @param {*} userId 人员id
     * @param {*} workStart 考勤规则配置的上班开始时间
     * @param {*} workEnd 考勤规则配置的上班结束时间
     * @returns
     * {
            userWorkStart: date / null
            userWorkEnd: date / null
            hasLeave: boolean // 有请假
            hasBusiness: boolean // 有出差
            hasOut: boolean // 有外出
            noNeedToAttend: boolean // 无需考勤，如全天请假，userWorkStart为null，userWorkEnd为null
        }
        如果用户全天请假，则userWorkStart为null，userWorkEnd为null
     */
    handler: async function (userId, workStart, workEnd) {
        const broker = this.broker;
        let userWorkStart = workStart;
        let userWorkEnd = workEnd;
        // 查找用户请假开始时间或者请假结束时间在正常上班时间段内的请假记录
        // 早上请假
        const leaveMorning = await broker.call('objectql.find', {
            objectName: 'attendance_leave',
            query: {
                filters: [
                    ['staff', '=', userId],
                    ['start', '<=', workStart],
                    ['end', '>', workStart],
                    ['end', '<', workEnd],
                    ['instance_state', '=', 'approved']
                ]
            }
        })
        if (leaveMorning.length >= 2) {
            console.error('请假记录有误，早上请假记录大于等于2条，请检查！', `请假记录：${JSON.stringify(leaveMorning)}`)
        }
        const leaveMorningDoc = leaveMorning[0];
        if (leaveMorningDoc) {
            // 如果有则取上班时间为请假结束时间
            userWorkStart = leaveMorningDoc.end;
        }

        // 上班时间段内请假，如早上10点到下午2点请假
        const leaveInWorkTime = await broker.call('objectql.find', {
            objectName: 'attendance_leave',
            query: {
                filters: [
                    ['staff', '=', userId],
                    ['start', '>', workStart],
                    ['end', '<', workEnd],
                    ['instance_state', '=', 'approved']
                ],
                fields: ['start', 'end'],
                sort: 'start asc'
            }
        })
        // 遍历leaveInWorkTime，如果有请假记录，用第一条的开始时间与userWorkStart比较看是时间段是否连续，如连续则用第一条的结束时间作为userWorkStart与剩下的结束时间比较，找出连续的请假记录，最大的结束时间为userWorkStart
        if (leaveInWorkTime.length > 0) {
            if (leaveInWorkTime[0].start <= userWorkStart && userWorkStart <= leaveInWorkTime[0].end) {
                userWorkStart = leaveInWorkTime[0].end;
                for (let i = 1; i < leaveInWorkTime.length; i++) {
                    if (leave.start <= userWorkStart && userWorkStart <= leave.end) {
                        userWorkStart = leave.end;
                    }
                }
            }
        }

        // 下午请假
        const leaveAfternoon = await broker.call('objectql.find', {
            objectName: 'attendance_leave',
            query: {
                filters: [
                    ['staff', '=', userId],
                    ['start', '>', workStart],
                    ['start', '<', workEnd],
                    ['end', '>=', workEnd],
                    ['instance_state', '=', 'approved']
                ]
            }
        })
        if (leaveAfternoon.length >= 2) {
            console.error('请假记录有误，下午请假记录大于等于2条，请检查！', `请假记录：${JSON.stringify(leaveAfternoon)}`)
        }
        const leaveAfternoonDoc = leaveAfternoon[0];
        if (leaveAfternoonDoc) {
            // 如果有则取下班时间为请假开始时间
            userWorkEnd = leaveAfternoonDoc.start;
        }

		// 考虑跨天请假问题
		const leaveTimeRange = await broker.call('objectql.find', {
            objectName: 'attendance_leave',
            query: {
                filters: [
                    ['applicant', '=', userId],
                    ['start_time', '>', workStart],
					['end_time','>',workEnd]
                    ['instance_state', '=', 'approved']
                ]
            }
        })

        // 查找用户出差开始时间或者出差结束时间在正常上班时间段内的出差记录
        // 早上出差
        const businessMorning = await broker.call('objectql.find', {
            objectName: 'attendance_business_out',
            query: {
                filters: [
                    ['applicant', '=', userId],
                    ['start_time', '<=', workStart],
                    ['end_time', '>', workStart],
                    ['end_time', '<', workEnd],
                    ['instance_state', '=', 'approved']
                ]
            }
        })
        if (businessMorning.length >= 2) {
            console.error('出差记录有误，早上出差记录大于等于2条，请检查！', `出差记录：${JSON.stringify(businessMorning)}`)
        }
        const businessMorningDoc = businessMorning[0];
        if (businessMorningDoc) {
            // 如果有则取上班时间为出差结束时间
            userWorkStart = businessMorningDoc.end_time;
        }

        // 上班时间段内出差，如早上10点到下午2点出差
        const businessInWorkTime = await broker.call('objectql.find', {
            objectName: 'attendance_business_out',
            query: {
                filters: [
                    ['applicant', '=', userId],
                    ['start_time', '>', workStart],
                    ['end_time', '<', workEnd],
                    ['instance_state', '=', 'approved']
                ],
                fields: ['start_time', 'end_time'],
                sort: 'start_time asc'
            }
        })
        // 遍历businessInWorkTime，如果有出差记录，用第一条的开始时间与userWorkStart比较看是时间段是否连续，如连续则用第一条的结束时间作为userWorkStart与剩下的结束时间比较，找出连续的出差记录，最大的结束时间为userWorkStart
        if (businessInWorkTime.length > 0) {
            if (businessInWorkTime[0].start_time <= userWorkStart && userWorkStart <= businessInWorkTime[0].end_time) {
                userWorkStart = businessInWorkTime[0].end_time;
                for (let i = 1; i < businessInWorkTime.length; i++) {
                    if (businessInWorkTime.start_time <= userWorkStart && userWorkStart <= businessInWorkTime.end_time) {
                        userWorkStart = businessInWorkTime.end_time;
                    }
                }
            }
        }

        // 下午出差
        const businessAfternoon = await broker.call('objectql.find', {
            objectName: 'attendance_business_out',
            query: {
                filters: [
                    ['applicant', '=', userId],
                    ['start_time', '>', workStart],
                    ['start_time', '<', workEnd],
                    ['end_time', '>=', workEnd],
                    ['instance_state', '=', 'approved']
                ]
            }
        })
        if (businessAfternoon.length >= 2) {
            console.error('出差记录有误，下午出差记录大于等于2条，请检查！', `出差记录：${JSON.stringify(businessAfternoon)}`)
        }
        const businessAfternoonDoc = businessAfternoon[0];
        if (businessAfternoonDoc) {
            // 如果有则取下班时间为出差开始时间
            userWorkEnd = businessAfternoonDoc.start_time;
        }
		// 跨天出差问题
		const businessTimeRange = await broker.call('objectql.find', {
            objectName: 'attendance_business_out',
            query: {
                filters: [
                    ['applicant', '=', userId],
                    ['start_time', '>', workStart],
					['end_time','>',workEnd]
                    ['instance_state', '=', 'approved']
                ]
            }
        })


        // 查找用户外出开始时间或者外出结束时间在正常上班时间段内的外出记录
        // 早上外出
        const outMorning = await broker.call('objectql.find', {
            objectName: 'attendance_going_out',
            query: {
                filters: [
                    ['applicant', '=', userId],
                    ['start_time', '<=', workStart],
                    ['end_time', '>', workStart],
                    ['end_time', '<', workEnd],
                    ['instance_state', '=', 'approved']
                ]
            }
        })
        if (outMorning.length >= 2) {
            console.error('外出记录有误，早上外出记录大于等于2条，请检查！', `外出记录：${JSON.stringify(outMorning)}`)
        }
        const outMorningDoc = outMorning[0];
        if (outMorningDoc) {
            // 如果有则取上班时间为外出结束时间
            userWorkStart = outMorningDoc.end_time;
        }

        // 上班时间段内外出，如早上10点到下午2点外出
        const outInWorkTime = await broker.call('objectql.find', {
            objectName: 'attendance_going_out',
            query: {
                filters: [
                    ['applicant', '=', userId],
                    ['start_time', '>', workStart],
                    ['end_time', '<', workEnd],
                    ['instance_state', '=', 'approved']
                ],
                fields: ['start_time', 'end_time'],
                sort: 'start_time asc'
            }
        })
        // 遍历outInWorkTime，如果有外出记录，用第一条的开始时间与userWorkStart比较看是时间段是否连续，如连续则用第一条的结束时间作为userWorkStart与剩下的结束时间比较，找出连续的外出记录，最大的结束时间为userWorkStart
        if (outInWorkTime.length > 0) {
            if (outInWorkTime[0].start_time <= userWorkStart && userWorkStart <= outInWorkTime[0].end_time) {
                userWorkStart = outInWorkTime[0].end_time;
                for (let i = 1; i < outInWorkTime.length; i++) {
                    if (outInWorkTime.start_time <= userWorkStart && userWorkStart <= outInWorkTime.end_time) {
                        userWorkStart = outInWorkTime.end_time;
                    }
                }
            }
        }

        // 下午外出
        const outAfternoon = await broker.call('objectql.find', {
            objectName: 'attendance_going_out',
            query: {
                filters: [
                    ['applicant', '=', userId],
                    ['start_time', '>', workStart],
                    ['start_time', '<', workEnd],
                    ['end_time', '>=', workEnd],
                    ['instance_state', '=', 'approved']
                ]
            }
        })
        if (outAfternoon.length >= 2) {
            console.error('外出记录有误，下午外出记录大于等于2条，请检查！', `外出记录：${JSON.stringify(outAfternoon)}`)
        }
        const outAfternoonDoc = outAfternoon[0];
        if (outAfternoonDoc) {
            // 如果有则取下班时间为外出开始时间
            userWorkEnd = outAfternoonDoc.start_time;
        }

		// 考虑跨天外出的情况  //2023-08-09 09:00  2023-08-10 14:00   //0809 9:00 18:00
		const outTimeRange = await broker.call('objectql.find', {
            objectName: 'attendance_going_out',
            query: {
                filters: [
                    ['applicant', '=', userId],
                    ['start_time', '>', workStart],
					['end_time','>',workEnd]
                    ['instance_state', '=', 'approved']
                ]
            }
        })

        const hasLeave = leaveMorningDoc || leaveAfternoonDoc || leaveInWorkTime.length > 0||leaveTimeRange.length>0;

        const hasBusiness = businessMorningDoc || businessAfternoonDoc || businessInWorkTime.length > 0 || businessTimeRange.length>0;

		const hasOut = outMorningDoc || outAfternoonDoc || outInWorkTime.length > 0 || outTimeRange.length >0;
		
        let noNeedToAttend = false; // 需考勤

        // 如果用户下班时间小于等于上班时间，则说明用户全天请假
        if (userWorkEnd <= userWorkStart) {
            userWorkStart = null
            userWorkEnd = null
            noNeedToAttend = true // 无需考勤
        }

        return {
            userWorkStart,
            userWorkEnd,
            hasLeave,
            hasBusiness,
            hasOut,
            noNeedToAttend
        }


    }
}
