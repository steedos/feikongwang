/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-25 09:25:39
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-25 09:26:29
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/crm/src/methods/getDocConverts.js
 * @Description: 
 */
module.exports = {
    handler(object_name, record) {
        const convertSettings = {
            "accounts": {
                "website": "website",
                "email": "email",
                "industry": "industry",
                "phone": "phone",
                "number_of_employees": "number_of_employees",
                "mobile": "mobilephone",
                "lead_source": "lead_source",
                "rating": "rating",
                "billing_address": "address"
            },
            "contacts": {
                "salutation": "salutation",
                "title": "title",
                "email": "email",
                "phone": "phone",
                "mobile": "mobilephone",
                "lead_source": "lead_source",
                "mailing_address": "address"
            },
            "opportunity": {
                "lead_source": "lead_source",
                "rating": "rating",
                "campaign_id": "campaign_id"
            }
        };
        let result = {};
        const converts = Object.assign({}, convertSettings[object_name]);
        _.each(converts, (item, key) => {
            result[key] = record[item];
        });
        return result;
    }
}