module.exports = {

    edit_purchaser_seller_infoVisible: function(object_name, record_id, record_permissions, props) {
        console.log("edit_purchaser_seller_infoVisible", props);
        debugger;
        const record = props.record;
        const appId = props.app_id;
        if ('contracts_ee' == appId && 'passed' == record.verify_status) {
            const fpId = record.finance_payment
            if (!fpId) {
                return true;
            } else {
                var queryResult = Steedos.authRequest("/graphql", {
                    type: 'POST',
                    async: false,
                    data: JSON.stringify({
                        query: `{record:finance_payment__findOne(id: "${fpId}"){instance_state}}`
                    }),
                    contentType: 'application/json',
                    error: function() {}
                });
                var recordDoc = queryResult && queryResult.data && queryResult.data.record;
                if (recordDoc && (!recordDoc.instance_state || 'draft' == recordDoc.instance_state)) {
                    return true;
                }
            }
        }


        return false;
    }

}