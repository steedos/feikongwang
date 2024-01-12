module.exports = {
  standard_new: function (object_name, record_id) {

  },
  standard_newVisible: function (object_name, record_id, record_permissions, record) {
      const sizeUp = true;
      var status = null
      if(record.__super.__super._master){
              sizeUp = false;
      }
      return sizeUp;
  }
}