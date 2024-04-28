/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-24 14:12:40
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-24 14:15:22
 * @FilePath: /steedos-ee-gitlab/steedos-packages-oa/asset/src/methods/asset_details/setAssetCardField.js
 * @Description: 
 */
"use strict";
// @ts-check

const _ = require('lodash');

module.exports = {
    /**
     * 计算资产领用/调拨/报废的资产卡片
     * 资产领用/调拨/报废明细选择的资产卡片，自动赋值给主表资产领用/调拨/报废单
     * @param {*} objectId 
     */
    async handler(objectId, object_name, object_detail) {
        if (!objectId) {
            return;
        }
        const objectObj = this.getObject(object_name);
        const detailObj = this.getObject(object_detail);
        const assetObj = this.getObject('assets_card');
        const detailDocs = await detailObj.find({ filters: [[object_name, '=', objectId]] });
        const assetIds = _.uniq(_.map(detailDocs, 'assets_card'));
        const assetDocs = await assetObj.find({ filters: [['_id', 'in', assetIds]] });
        const newAssetIds = [];
        for (const doc of assetDocs) {
            newAssetIds.push(doc._id);
        }
        await objectObj.directUpdate(objectId, { assets_card: newAssetIds });
    }
}

/**
 *     setAssetCardField: async function (objectId,object_name,object_detail) {
        if (!objectId) {
            return;
        }
        const objectObj = objectql.getObject(object_name);
        const detailObj = objectql.getObject(object_detail);
        const assetObj = objectql.getObject('assets_card');
        const detailDocs = await detailObj.find({ filters: [[object_name, '=', objectId]] });
        const assetIds = _.uniq(_.map(detailDocs, 'assets_card'));
        const assetDocs = await assetObj.find({ filters: [['_id', 'in', assetIds]] });
        const newAssetIds = [];
        for (const doc of assetDocs) {
            newAssetIds.push(doc._id);
        }
        await objectObj.directUpdate(objectId, { assets_card: newAssetIds });
    }
 */