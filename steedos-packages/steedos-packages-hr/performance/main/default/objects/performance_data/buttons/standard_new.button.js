module.exports = {

    // standard_new: function () {

    // },
    standard_newVisible: function (object_name, record_id, record_permissions, props) {
        // 考核数据只能通过考核计划明细生成，不可手动新建
        return false;
    }
}