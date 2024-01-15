module.exports = {
    uploadVisible: function(object_name, record_id, record_permissions, record) {
        var status = record.__super.__super._master.record.instance_state;
        var sizeUp = true;
        if (status == "approved") {
            sizeUp = false;
        }
        return sizeUp;
    }

}