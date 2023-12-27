/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-25 14:42:57
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-25 14:59:21
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/purchase/src/triggers/index.js
 * @Description: 
 */
module.exports = {
    purchase_order_trigger: require('./purchase_order_trigger'),
    purchase_stock_delivery_trigger: require('./purchase_stock_delivery_trigger'),
    purchase_stock_picking_trigger: require('./purchase_stock_picking_trigger'),
}