/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-24 11:51:54
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-24 11:52:43
 * @FilePath: /steedos-ee-gitlab/steedos-packages-hr/hr/src/actions/index.js
 * @Description: 
 */
module.exports = {
    ...require('./hr_job_transfer'),
    ...require('./hr_onboarding'),
    ...require('./hr_regular_apply'),
    ...require('./hr_resign_apply'),
}