/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-24 13:09:01
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-24 13:33:05
 * @FilePath: /steedos-ee-gitlab/steedos-packages-oa/asset/src/rests/api_asset_recipient_check_approve.js
 * @Description: 资产领用单发起审批时校验是否符合发起条件
 */
module.exports = {
    rest: {
        method: 'POST',
        fullPath: '/api/asset/recipient/:id/check_approve'
    },
    params: {
        id: { type: 'string' }
    },
    async handler(ctx) {
        try {
            const userSession = ctx.meta.user;
            const spaceId = userSession.spaceId;
            // const userId = userSession.userId;
            // const isSpaceAdmin = userSession.is_space_admin;
            const recipientId = ctx.params.id;
            const recipeintDetailObj = this.getObject('asset_recipient_detail');
            const assetObj = this.getObject('assets_card');
            const recipientObj = this.getObject('asset_recipient');

            const details = await recipeintDetailObj.find({ filters: [['asset_recipient', '=', recipientId]] });

            if (details.length == 0) {
                throw new Error('请先添加资产领用明细');
            }
            // 解析出资产卡片的id
            const assetIds = [];
            for (const detail of details) {
                assetIds.push(detail.assets_card);
            }

            // 查找所有审批中的资产领用单
            const pendingRecipients = await recipientObj.find({ filters: [['space', '=', spaceId], ['instance_state', 'in', ['draft', 'pending']]] });
            // 遍历资产领用单，获取assetIds范围内的资产领用单明细的领用数量
            const pendingDetailsMap = {};
            for (const pendingRecipient of pendingRecipients) {
                const pendingDetails = await recipeintDetailObj.find({ filters: [['asset_recipient', '=', pendingRecipient._id], ['assets_card', 'in', assetIds]] });
                for (const pendingDetail of pendingDetails) {
                    if (!pendingDetailsMap[pendingDetail.assets_card]) {
                        pendingDetailsMap[pendingDetail.assets_card] = 0;
                    }
                    pendingDetailsMap[pendingDetail.asset_card] += pendingDetail.quantity || 0;
                }
            }

            // 遍历资产领用明细，校验数量是否超出可领用数量
            for (const detail of details) {
                const asset = await assetObj.findOne({ filters: [['_id', '=', detail.assets_card]] });
                if (asset.quantity < (detail.quantity + pendingDetailsMap[detail.assets_card])) {
                    throw new Error(`${asset.name}的可领用数量不足`);
                }
            }

            return {
                'status': 0, // 返回 0，表示当前接口正确返回，否则按错误请求处理
                'msg': '',
                'data': {
                }
            }
        } catch (error) {
            return {
                'status': -1,
                'msg': error.message,
                'data': {
                }
            }
        }

    }
}