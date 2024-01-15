module.exports = {
  standard_newVisible: function (object_name, record_id, record_permissions, record) {
      var sizeUp = true;
      var status = null
      if(record.__super.__super._master){
              sizeUp = false;
      }
      return sizeUp;
  }
}