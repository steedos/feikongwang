/*
 * @Author: 苏佳豪 sujiahao@steedos.com
 * @Date: 2023-09-26 16:33:29
 * @LastEditors: 苏佳豪 sujiahao@steedos.com
 * @LastEditTime: 2023-09-27 11:26:45
 * @Description: 
 */
const _ = require('lodash');
module.exports = {
    /**
     * 更新供应商信息，如果供应商名称变更,则生成新的供应商并把新纪录的_id返回,否则返回null
     * @param {*} supplierId 供应商id
     * @param {*} updateDoc 
     * @return {*} 供应商_id 或者 null
     */
    async updateSupplier (supplierId, updateDoc) {
        const supplier = await this.broker.call('objectql.findOne', { 'objectName': 'accounts', 'id': supplierId, 'query': {'fields': []} });
        if (supplier.name === updateDoc.name) {
            await this.broker.call('objectql.update', {'objectName': 'accounts', 'id': supplierId, 'doc': updateDoc});
            return null;

        } else {
            try {
                const newSupplierId = await this.broker.call(
                    'objectql._makeNewID',
					{
						'objectName': 'accounts'
					}
                );
                // 旧供应商标记为“停用”
                await this.broker.call('objectql.update', {'objectName': 'accounts', 'id': supplier._id, 'doc': {'status': 'disabled'}});
                // 添加新供应商
                const newSupplier = Object.assign({}, supplier, updateDoc, {'_id': newSupplierId});
                await this.broker.call('objectql.insert', {'objectName': 'accounts', 'doc': newSupplier});
                return {'id': newSupplierId};
            } catch (error) {
                console.error(error);
                return null;
            }
        }
    },

    /**
     * 将旧供应商的相关子表数据，关联到新供应商
     * 目前已处理的子表数据：合同数据、银行账号、联系人
     * @param {*} supplierId 
     * @param {*} newSupplierId 
     */
    async updateRelatedData(supplierId, newSupplierId) {
        // 处理联系人
        const contacts = await this.broker.call(
            'objectql.find', 
            {'objectName': 'contacts', 'query': {'filters': ['account', '=', supplierId]}}
        );
        for (const item of contacts) {
            let updateDoc = Object.assign({}, item, {'account': newSupplierId});
            delete updateDoc._id;
            await this.broker.call('objectql.insert', {'objectName': 'contacts', 'doc': updateDoc});
        }

        // 处理银行账号
        const account_banks = await this.broker.call(
            'objectql.find', 
            {'objectName': 'account_banks', 'query': {'filters': ['account', '=', supplierId]}}
        );
        for (const item of account_banks) {
            let updateDoc = Object.assign({}, item, {'account': newSupplierId});
            delete updateDoc._id;
            await this.broker.call('objectql.insert', {'objectName': 'account_banks', 'doc': updateDoc});
        }
        
        // 处理合同信息: 所有未结算的合同中的供应商，改为新的供应商
        const contracts = await this.broker.call(
           'objectql.find',
           {
            'objectName': 'contracts', 
            'query': {
                'filters': [['othercompany', 'contains', supplierId]],
                'fields': ['othercompany', '_id']
            } 
        });
        for (const contract of contracts) {
            let suppliers = new Array(contract.othercompany).filter(item => item !== supplierId)
            suppliers.push(newSupplierId);
            await this.broker.call(
                'objectql.update', 
                {'objectName': 'contracts', 'id': contract._id, 'doc': {'othercompany': suppliers}}
            );
        }
    }
}