/*
 * @Author: 苏佳豪 sujiahao@steedos.com
 * @Date: 2023-09-26 16:02:10
 * @LastEditors: 苏佳豪 sujiahao@steedos.com
 * @LastEditTime: 2023-10-07 11:31:27
 * @Description: 处理供应商变更相关逻辑
 */
module.exports = {
    modifySupplier: {
        params: {
            'supplierId': {type: 'string'},
            'updateDoc': {type: 'object'}
        },
        async handler(ctx) {
            const {supplierId, updateDoc} = ctx.params;
            
            // 使用updateDoc更新供应商信息，如果供应商名称变更，则生成一条新的供应商记录，
            const newSupplier = await this.updateSupplier(supplierId, updateDoc);

            // 名称变更后，将旧供应商的数据关联到新的供应商
            if (newSupplier) {
                await this.updateRelatedData(supplierId, newSupplier.id);
            }
        }
    }
}