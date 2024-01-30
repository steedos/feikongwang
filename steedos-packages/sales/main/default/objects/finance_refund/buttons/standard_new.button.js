module.exports = {
  standard_newVisible: function (object_name, record_id, record_permissions, record) {
    if(record.relatedKey=="finance_pre_receive"){
      return false;
    }
      return true;
  }
}