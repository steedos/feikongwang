/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-04 16:55:02
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-08-07 13:47:22
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance/src/schedules/dailySettlement.js
 * @Description: 
 */
'use strict';
// @ts-check

const schedule = require('node-schedule');
const moment = require('moment');
const chalk = require('chalk');
module.exports = {
    run: async function (broker) {
        const rule = process.env.STEEDOS_CRON_ATTENDANCE_DAILY_SETTLEMENT
        if (!rule) {
            return;
        }
        console.log(chalk.blue('考勤每日结算: 已配置定时器：', rule));

        let next = true;
        schedule.scheduleJob(rule, async function () {
            try {
                if (!next) {
                    return;
                }
                next = false;
                console.time('考勤每日结算');

                const date = moment().add(-1, 'days').format('YYYY-MM-DD'); // 前一天
                await broker.call('@steedos-labs/attendance.dailySettlement', {
                    date
                });

                console.timeEnd('考勤每日结算');
                next = true;
            } catch (error) {
                console.error(error.stack);
                console.error('考勤每日结算: ', error.message);
                next = true;
            }
        });
    }
}
