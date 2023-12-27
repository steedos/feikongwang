module.exports = {

    confim_order_btn: function(objectApiName, record_id) {
        console.log(objectApiName)
        console.log(record_id)
        swal({
                title: "是否确认订单？",

                html: !0,
                showCancelButton: !0,
                confirmButtonText: '确定',
                cancelButtonText: "取消"
            },
            function(t) {
                if (t) {
                    Creator.odata.update("purchase_order", record_id, {
                        state: "采购订单"
                    }, function() {
                        FlowRouter.reload()
                    })

                }
            })
    },
    confim_order_btnVisible: function(object_name, record_id, permissions, record) {
        return record.state === '询价';
    }

}