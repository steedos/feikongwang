module.exports = {
  standard_approveVisible: function (object_name, record_id, record_permissions, record) {
    let is_active = record.__super.is_active
    if(is_active){
      return false;
    }
      return true;
  }
}