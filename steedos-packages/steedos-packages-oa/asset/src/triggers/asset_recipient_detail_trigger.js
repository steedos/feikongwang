"use strict";
// @ts-check
module.exports = {
    trigger: {
        listenTo: 'asset_recipient_detail', // 资产领用明细
        when: [
            'afterInsert',
            'afterUpdate',
            'afterDelete'
        ],
    },
    async handler(ctx) {
        const { isInsert, isUpdate, isDelete, isFind, isBefore, isAfter, id, doc, previousDoc, size, userId, spaceId, objectName, query, data } = ctx.params;

        if (isAfter) {
            if (isInsert) {
                const asset_recipient = "asset_recipient";
                const asset_recipient_detail = "asset_recipient_detail";
                await this.setAssetCardField(doc.asset_recipient, asset_recipient, asset_recipient_detail);
            }
            if (isUpdate) {
                const asset_recipient = "asset_recipient";
                const asset_recipient_detail = "asset_recipient_detail";
                await this.setAssetCardField(doc.asset_recipient, asset_recipient, asset_recipient_detail);
            }
            if (isDelete) {
                const asset_recipient = "asset_recipient";
                const asset_recipient_detail = "asset_recipient_detail";
                await this.setAssetCardField(previousDoc.asset_recipient, asset_recipient, asset_recipient_detail);
            }
        }
    }
}

/**
 * const objectql = require('@steedos/objectql');
const details = require('../details/asset_details');

module.exports = {
    listenTo: 'asset_recipient_detail',

    beforeInsert: async function(){
    
    },

    beforeUpdate: async function(){
    
    },

    beforeDelete: async function(){
    
    },

    afterInsert: async function(){
        const doc = this.doc;
        const asset_recipient = "asset_recipient";
        const asset_recipient_detail = "asset_recipient_detail";
        await details.setAssetCardField(doc.asset_recipient,asset_recipient,asset_recipient_detail);
    },

    afterUpdate: async function(){
        const doc = this.doc;
        const asset_recipient = "asset_recipient";
        const asset_recipient_detail = "asset_recipient_detail";
        await details.setAssetCardField(doc.asset_recipient,asset_recipient,asset_recipient_detail);
    },

    afterDelete: async function(){
        const previousDoc = this.previousDoc;
        const asset_recipient = "asset_recipient";
        const asset_recipient_detail = "asset_recipient_detail";
        await details.setAssetCardField(previousDoc.asset_recipient,asset_recipient,asset_recipient_detail);
    },

}
 */