/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-24 11:23:19
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-24 11:32:52
 * @FilePath: /steedos-ee-gitlab/steedos-packages-hr/hr/src/rest/api_hr_personnel_statistic.js
 * @Description: 
 */
"use strict";
// @ts-check

const fetch = require('node-fetch');

module.exports = {
    rest: {
        method: 'GET',
        fullPath: '/api/hr/personnel_statistic'
    },
    async handler(ctx) {

        let data = [0, 0, 0, 0, 0];

        const userSession = ctx.meta.user;
        const spaceId = userSession.spaceId;
        const authToken = userSession.authToken;
        const authorization = "Bearer " + spaceId + "," + authToken;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': authorization
        };

        const rootURL = process.env.ROOT_URL;

        // 入职人数
        const onboardingRequestData = {
            query: "{ rows: hr_onboarding(filters: [[\"created\",\"between\",\"{this_year}\"]]) { _id, name, created}}"
        };
        const onboardingRes = await fetch(rootURL + '/graphql', {
            method: 'post',
            body: JSON.stringify(onboardingRequestData),
            headers: headers
        });
        const onboardingResult = await onboardingRes.json();
        const onboardingCount = onboardingResult.data.rows.length;
        data[0] = onboardingCount;

        // 转正人数
        const regularRequestData = {
            query: "{ rows: hr_regular_apply(filters: [[\"created\",\"between\",\"{this_year}\"]]) { _id, name, created}}"
        };
        const regularRes = await fetch(rootURL + '/graphql', {
            method: 'post',
            body: JSON.stringify(regularRequestData),
            headers: headers
        });
        const regularResult = await regularRes.json();
        const regularCount = regularResult.data.rows.length;
        data[1] = regularCount;

        // 调动人数
        const transferRequestData = {
            query: "{ rows: hr_job_transfer(filters: [[\"created\",\"between\",\"{this_year}\"]]) { _id, name, created}}"
        };
        const transferRes = await fetch(rootURL + '/graphql', {
            method: 'post',
            body: JSON.stringify(transferRequestData),
            headers: headers
        });
        const transferResult = await transferRes.json();
        const transferCount = transferResult.data.rows.length;
        data[2] = transferCount;


        // 离职人数
        const resignRequestData = {
            query: "{ rows: hr_resign_apply(filters: [[\"created\",\"between\",\"{this_year}\"]]) { _id, name, created}}"
        };
        const resignRes = await fetch(rootURL + '/graphql', {
            method: 'post',
            body: JSON.stringify(resignRequestData),
            headers: headers
        });
        const resignResult = await resignRes.json();
        const resignCount = resignResult.data.rows.length;
        data[3] = resignCount;

        // 在职人数
        const onlineRequestData = {
            query: "{ rows: space_users(filters: [[\"created\",\"between\",\"{this_year}\"],[\"user_accepted\",\"=\",true]]) { _id, name, created}}"
        };
        const onlineRes = await fetch(rootURL + '/graphql', {
            method: 'post',
            body: JSON.stringify(onlineRequestData),
            headers: headers
        });
        const onlineResult = await onlineRes.json();
        const onlineCount = onlineResult.data.rows.length;
        data[4] = onlineCount;


        return {
            'status': 0, // 返回 0，表示当前接口正确返回，否则按错误请求处理
            'msg': '',
            'data': data
        }
    }
}