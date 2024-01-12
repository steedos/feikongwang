module.exports = {
    trigger: {
        listenTo: 'sales_orders',
        when: [
            'beforeInsert',
            'beforeUpdate',
        ],
    },
    async handler(ctx) {
        const {
            spaceId,
            isBefore,
            isInsert,
            isUpdate,
            doc
        } = ctx.params;

        const contacts = this.getObject("contacts");

        if (isBefore) {

            if (isInsert || isUpdate) {
                // 查询联系人
                const { buyer: buyerId } = doc
                if (buyerId) {
                    let contact = await contacts.findOne(buyerId);

                    if (contact && contact.mobile){
                        doc.buyer_mobile = contact.mobile;
                    }else if(contact && contact.phone){
                        doc.buyer_mobile = contact.phone;
                    }
                }
                
                return {
                    doc
                }
                
            }

        }

    }

}
