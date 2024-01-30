module.exports = {
  standard_approveVisible: function (object_name, record_id, record_permissions, record) {
    let is_active = record.__super.is_active;
    let instance_state = record.__super.instance_state;
    if(is_active || instance_state != undefined){
      return false;
    }
      return true;
  }
}