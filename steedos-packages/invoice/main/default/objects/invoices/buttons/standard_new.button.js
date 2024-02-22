module.exports = {
    standard_newVisible: function (object_name, record_id, record_permissions, record) {
        var sizeUp = true;
        if(record.__super.__super._master && record.__super.__super._master.record.locked){
                sizeUp = false;
        }
        return sizeUp;
    }
}