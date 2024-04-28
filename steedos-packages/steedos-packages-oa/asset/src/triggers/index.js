/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-24 13:54:03
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-24 15:33:25
 * @FilePath: /steedos-ee-gitlab/steedos-packages-oa/asset/src/triggers/index.js
 * @Description: 
 */
module.exports = {
    actual_warehouse_entry_trigger: require('./actual_warehouse_entry_trigger'),
    asset_allocation_detail_trigger: require('./asset_allocation_detail_trigger'),
    asset_allocation_trigger: require('./asset_allocation_trigger'),
    asset_recipient_detail_trigger: require('./asset_recipient_detail_trigger'),
    assets_warehouse_entry_trigger: require('./assets_warehouse_entry_trigger'),
    warehousing_detail_trigger: require('./warehousing_detail_trigger'),
}