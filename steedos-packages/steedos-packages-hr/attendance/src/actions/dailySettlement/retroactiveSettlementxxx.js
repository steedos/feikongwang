/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-08 09:51:27
 * @LastEditors: 高红新 gaohongxin@steedos.com
 * @LastEditTime: 2023-08-16 18:11:53
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance/src/actions/dailySettlement/retroactiveSettlement.js
 * @Description: 补卡台账审批通过后结算
 */

'use strict';
const _ = require('lodash');
const moment = require('moment');
module.exports = {
  
    handler: async function (ctx) {
        // const { retroactiveId } = ctx.params;
        // console.log("补卡台账审批通过后结算", retroactiveId)
        // // 获取补卡台账
        // const retroactive = await ctx.call('objectql.findOne', {
        //     objectName: 'attendance_retroactive',
        //     id: retroactiveId,
        // })
        // console.log("补卡信息", retroactive)
        // if (!retroactive) {
        //     throw new Error('补卡台账不存在');
        // }

        // const { attendance_daily: attendanceDailyId, type, start: startTime, end: endTime } = retroactive;

        // // 获取补卡台账对应的每日考勤记录
        // const attendanceDaily = await ctx.call('objectql.findOne', {
        //     objectName: 'attendance_daily',
        //     id: attendanceDailyId,
        // })
        // console.log("每日考勤情况", attendanceDaily)
        // if (!attendanceDaily) {
        //     throw new Error('每日考勤记录不存在');
        // }

        // const { _id: attId, status, user: userId, date } = attendanceDaily;
        // // 根据每日考勤情况，更新考勤状态

        // // 获取结算范围
        // const scope = await this.getSettlementScope(userId);
        // console.log("结算范围", scope)
        // const rule = scope[0]
        // const { work_start, work_end } = rule;
        // // 正常上班开始时间
        // const workStart = this.generateDateTimeByDateAndTime(date, work_start)
        // console.log("上班开始时间", workStart)
        // // 正常上班结束时间
        // const workEnd = this.generateDateTimeByDateAndTime(date, work_end)
        // console.log("上班结束时间", workEnd)

        // const doc = {}
        // console.log("外出记录",!!attendanceDaily.retroactive_ref);
        // console.log("外出记录",attendanceDaily.retroactive_ref);
        // console.log("备注",attendanceDaily.remark);
        // console.log("备注",!!attendanceDaily.remark);
        // var retroactive_refs = []
        // // 迟到
        // if (attendanceDaily.status.includes('late')) {
        //     if ('work' === type) {
        //         // 上班卡：每日考勤状态移除迟到状态，上班打卡时间根据考勤规则更新为上班时间，迟到（分钟）更新为：0；
        //         _.pull(status, 'late')
        //         doc.start = startTime;
        //         doc.late = null;
        //         if (!!attendanceDaily.remark) {
        //             doc.remark = attendanceDaily.remark + ",补上班卡";
        //         } else {
        //             doc.remark = '补上班卡';
        //         }
        //         if(attendanceDaily.retroactive_ref){
        //             for(let retroactive_ref of attendanceDaily.retroactive_ref){
        //                 retroactive_refs.push(retroactive_ref)
        //             }
        //             retroactive_refs.push(retroactive._id)
        //             doc.retroactive_ref = retroactive_refs
        //         }else{
        //             retroactive_refs.push(retroactive._id)
        //             doc.retroactive_ref = retroactive_refs
        //         }
        //     }
        // }
        // // 早退
        // else if (attendanceDaily.status.includes('early')) {
        //     console.log("每日考勤情况状态迟到")
        //     if ('quit' === retroactive.type) {
        //         // 下班卡：每日考勤状态移除早退状态，下班打卡时间根据考勤规则更新为下班时间，早退（分钟）更新为：0,备注信息为：补下班卡 ；
        //         _.pull(status, 'early')
        //         doc.end = endTime
        //         doc.leave = null
        //         if (!!attendanceDaily.remark) {
        //             doc.remark = attendanceDaily.remark + ",补下班卡"
        //         } else {
        //             doc.remark = '补下班卡'
        //         }
        //         if(attendanceDaily.retroactive_ref){
        //             for(let retroactive_ref of attendanceDaily.retroactive_ref){
        //                 retroactive_refs.push(retroactive_ref)
        //             }
        //             retroactive_refs.push(retroactive._id)
        //             doc.retroactive_ref = retroactive_refs
        //         }else{
        //             retroactive_refs.push(retroactive._id)
        //             doc.retroactive_ref = retroactive_refs
        //         }
        //     }
        // }
        // // 旷工
        // else if (attendanceDaily.status.includes('absent')) {
        //     if ('work' === retroactive.type) {
        //         // 上班卡：每日考勤状态移除旷工状态，增加早退状态，上班打卡时间根据考勤规则更新为上班时间，迟到（分钟）更新为：备注信息改为：补上班卡；
        //         _.pull(status, 'absent')
        //         if (!status.includes('early')) {
        //             status.push('early')
        //         }
        //         doc.start = startTime
        //         doc.late = null
        //         if (!!attendanceDaily.remark) {
        //             doc.remark = attendanceDaily.remark + ",补上班卡"
        //         } else {
        //             doc.remark = '补上班卡'
        //         }
        //         if(attendanceDaily.retroactive_ref){
        //             for(let retroactive_ref of attendanceDaily.retroactive_ref){
        //                 retroactive_refs.push(retroactive_ref)
        //             }
        //             retroactive_refs.push(retroactive._id)
        //             doc.retroactive_ref = retroactive_refs
        //         }else{
        //             retroactive_refs.push(retroactive._id)
        //             doc.retroactive_ref = retroactive_refs
        //         }
                

        //     }
        //     else if ('quit' === retroactive.type) {
        //         // 下班卡：每日考勤状态移除旷工状态，增加迟到状态，下班打卡时间根据考勤规则更新为下班时间，早退（分钟）更新为：00,备注信息为：补下班卡；
        //         _.pull(status, 'absent')
        //         if (!status.includes('late')) {
        //             status.push('late')
        //         }
        //         doc.end = endTime
        //         doc.leave = null
        //         if (!!attendanceDaily.remark) {
        //             doc.remark = attendanceDaily.remark + ",补下班卡"
        //         } else {
        //             doc.remark = '补下班卡'
        //         }
        //         if(attendanceDaily.retroactive_ref){
        //             for(let retroactive_ref of attendanceDaily.retroactive_ref){
        //                 retroactive_refs.push(retroactive_ref)
        //             }
        //             retroactive_refs.push(retroactive._id)
        //             doc.retroactive_ref = retroactive_refs
        //         }else{
        //             retroactive_refs.push(retroactive._id)
        //             doc.retroactive_ref = retroactive_refs
        //         }
        //     }
        // }
        // console.log("修改每日考勤情况信息", doc);
        // if (_.isEmpty(doc)) {
        //     console.log("补卡类型错误")
        //     throw new Error('补卡错误，出现补卡未处理的情况');
        // }

        // // 如果每日考勤情况中的考勤状态为空，表示已经全部补卡完成，更新考勤状态为正常
        // if (_.isEmpty(status)) {
        //     doc.status = ['normal']
        // } else {
        //     doc.status = status;
        // }

        // await this.updateAttendanceDaily(attId, doc);

        // return 'success'

    }
}
