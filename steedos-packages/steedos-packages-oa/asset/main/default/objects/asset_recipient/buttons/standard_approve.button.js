/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-05-18 14:16:24
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-24 13:36:10
 * @Description: 
 */
module.exports = {
    standard_approveVisible: function (object_name, record_id, record_permissions) {
        const baseVisible = Steedos.StandardObjects.Base.Actions.standard_approve.visible.apply(this, arguments)

        if (false === baseVisible) {
            return baseVisible
        }

        // 可领用的数量不可超过 库存数量-审核中数量
        let url = `/api/asset/recipient/${record_id}/check_approve`;
        let options = {
            type: 'post',
            async: false,
        };
        const result = Steedos.authRequest(url, options);
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>standard_approveVisible', result);
        if (result.status !== 0) {
            return false;
        }

        return true;
    }
}