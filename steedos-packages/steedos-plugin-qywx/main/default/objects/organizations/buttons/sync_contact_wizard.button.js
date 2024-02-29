module.exports = {
    sync_contact_wizardVisible: function(object_name, record_id, record_permissions, record) {
        // 判断是否为企业微信类
        const isWeCom= /wxwork/i.test(navigator.userAgent);
        if(isWeCom){
            return true
        }else{
            return false
        }
    }

}