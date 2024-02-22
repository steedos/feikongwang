module.exports = {
  standard_newVisible: function (object_name, record_id, record_permissions, record) {
    if(record.relatedKey=="contract"){
      return false;
    }else if(record.relatedKey=="finance_invoice" && record.__super.__super.locked){
      return false;
    }
      return true;
  }
}