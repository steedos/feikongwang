module.exports = {
    standard_new: function (object_name, record_id) {

    },
    standard_newVisible: function (object_name, record_id, record_permissions, record) {
        const status = record.__super.__super._master.record.instance_state;
        const sizeUp = true;
        if (status == "approved") {
            sizeUp = false;
        }
        return sizeUp;
    }
}