module.exports = {
  standard_newVisible: function (object_name, record_id, record_permissions, record) {
    if(record.relatedKey=="contract_receive_detail" || record.relatedKey=="finance_pre_receive"){
      return false;
    }
      return true;
  }
}