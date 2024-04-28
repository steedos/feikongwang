module.exports = {
    cms_posts_previewVisible: function (object_name, record_id, permission, data) {
        var siteId = data.record && data.record.site;
        if(siteId){
            var result = Steedos.authRequest(Steedos.absoluteUrl('api/v1/cms_sites/' + siteId + '?fields=["visibility"]'), {async: false, type: 'get'});
            var site = result && result.data;
            return site && site.visibility === "public";
        }
        return false
    }
}