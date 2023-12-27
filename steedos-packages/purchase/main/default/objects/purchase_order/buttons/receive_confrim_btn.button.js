module.exports = {

    receive_confrim_btn: function(objectApiName, record_id) {
        console.log(objectApiName)
        console.log(record_id)
        swal({
                title: "是否确认生成相应入库单？",

                html: !0,
                showCancelButton: !0,
                confirmButtonText: '确定',
                cancelButtonText: "取消"
            },
            function(t) {
                if (t) {
                    Creator.odata.update("purchase_order", record_id, {
                        state: "入库"
                    }, function() {
                        FlowRouter.go("/app/purchase/purchase_stock_picking")
                    })

                }
            })
    },
    receive_confrim_btnVisible: function(object_name, record_id, permissions, record) {
        return record.state === '采购订单';
    }

}