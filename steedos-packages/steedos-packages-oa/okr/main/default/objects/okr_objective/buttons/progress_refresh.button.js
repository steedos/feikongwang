module.exports = {
    progress_refresh: function (object_name, record_id) {
        //  toastr.success(`${this.record._id}`);
        let records = Creator.odata.query('okr_key_results',  {
            $filter: "(objective eq '".concat(this.record._id, "')")
        }, true);
        records.forEach(function (item) {
            Creator.odata.update('okr_key_results', item._id, { description: "" })      
        });
        Creator.odata.update('okr_objective', this.record._id, { description: "" })
        location.reload() ;
    },
    progress_refreshVisible: function () {
        return true
    }
}