/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-24 14:10:56
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-24 14:40:43
 * @FilePath: /steedos-ee-gitlab/steedos-packages-oa/asset/src/methods/index.js
 * @Description: 
 */
module.exports = {
    ...require('./asset_allocation_detail_manager'),
    ...require('./asset_retirement_detail_manager'),
    ...require('./assets_warehouse_entry_manager'),
    ...require('./asset_details'),
    ...require('./public'),
}