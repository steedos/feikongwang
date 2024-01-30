module.exports = {
  standard_newVisible: function (object_name, record_id, record_permissions, record) {
    console.log("====>object_name",object_name);
    console.log("====>record",record);
    if(record.relatedKey=="invoiceapply"){
      return false;
    }
      return true;
  }
}