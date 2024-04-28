'use strict';
// @ts-check

module.exports = {
    /**
     * 当报废单审批通过后，更新资产卡片相关报废信息
     * @param {*} retirementDetailId 
     */
    async handler(retirementDetailId) {
        const detailDoc = await this.getObject('asset_retirement_detail').findOne(retirementDetailId);
        const retirementDoc = await this.getObject('asset_retirement').findOne(detailDoc.asset_retirement);
        if (detailDoc && retirementDoc && retirementDoc.instance_state == 'approved') {
            const { assets_card } = detailDoc;
            if (assets_card) {
                const cardObj = await this.getObject('assets_card');
                const cardDoc = await cardObj.findOne(assets_card);
                if (cardDoc) {
                    await cardObj.directUpdate(assets_card, {
                        depreciation_charged: detailDoc.depreciation_charged, // 已提折旧(元)
                        estimated_residual_value: detailDoc.estimated_residual_value, // 估计残值(元)
                        net_worth: detailDoc.net_worth, // 净值(元)
                        scrap_date: detailDoc.scrap_date // 报废日期
                    });
                }
            }
        }
    }
}

/**
 * async function updateCardRetireInfo(retirementDetailId) {
    const detailDoc = await objectql.getObject('asset_retirement_detail').findOne(retirementDetailId);
    const retirementDoc = await objectql.getObject('asset_retirement').findOne(detailDoc.asset_retirement);
    if (detailDoc && retirementDoc && retirementDoc.instance_state == 'approved') {
        const { assets_card } = detailDoc;
        if (assets_card) {
            const cardObj = await objectql.getObject('assets_card');
            const cardDoc = await cardObj.findOne(assets_card);
            if (cardDoc) {
                await cardObj.directUpdate(assets_card, {
                    depreciation_charged: detailDoc.depreciation_charged, // 已提折旧(元)
                    estimated_residual_value: detailDoc.estimated_residual_value, // 估计残值(元)
                    net_worth: detailDoc.net_worth, // 净值(元)
                    scrap_date: detailDoc.scrap_date // 报废日期
                });
            }
        }
    }
}
 */