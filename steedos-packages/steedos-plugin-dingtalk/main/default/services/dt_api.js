const fetch = require('node-fetch');
const _ = require('underscore')
exports.accessTokenGet = async function (key, secret) {
    var err, response;
    try {
        // response = HTTP.get("https://oapi.dingtalk.com/gettoken?appkey=" + key + "&appsecret=" + secret);
        response = await fetch("https://oapi.dingtalk.com/gettoken?appkey=" + key + "&appsecret=" + secret).then(res => res.json());
        
        if (response.errcode > 0) {
            throw response.errmsg;
        }
        return response;
    } catch (_error) {
        err = _error;
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with accessTokenGet. " + err), {
            response: err
        });
    }
};

exports.departmentGet = async function (access_token, department_id) {
    var err, response;
    try {
        response = await fetch("https://oapi.dingtalk.com/department/get?access_token=" + access_token + "&id=" + department_id).then(res => res.json());
        
        if (response.errcode > 0) {
            throw response.errmsg;
        }
        return response;
    } catch (_error) {
        err = _error;
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with departmentGet. " + err), {
            response: err
        });
    }
};

exports.departmentListGet = async function (access_token) {
    var err, response;
    try {
        response = await fetch("https://oapi.dingtalk.com/department/list?access_token=" + access_token).then(res => res.json());
        
        if (response.errcode > 0) {
            throw response.errmsg;
        }
        return response.department;
    } catch (_error) {
        err = _error;
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with departmentListGet. " + err), {
            response: err
        });
    }
};

exports.userListGet = async function (access_token, department_id) {
    var err, response;
    try {
        response = await fetch("https://oapi.dingtalk.com/user/list?access_token=" + access_token + "&department_id=" + department_id).then(res => res.json());
        
        if (response.errcode > 0) {
            throw response.errmsg;
        }
        return response.userlist;
    } catch (_error) {
        err = _error;
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with userListGet. " + err), {
            response: err
        });
    }
};

exports.jsapiTicketGet = function (access_token) {
    var err, response;
    try {
        response = HTTP.get("https://oapi.dingtalk.com/get_jsapi_ticket?access_token=" + access_token, {
            data: {
                access_token: access_token,
                type: 'jsapi'
            },
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.error_code) {
            throw response.msg;
        }
        if (response.data.errcode > 0) {
            throw response.data.errmsg;
        }
        return response.data;
    } catch (_error) {
        err = _error;
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with jsapiTicketGet. " + err), {
            response: err
        });
    }
};

exports.userInfoGet = async function (access_token, code) {
    var err, response;
    try {
        response = await fetch("https://oapi.dingtalk.com/user/getuserinfo?access_token=" + access_token + "&code=" + code).then(res => res.json());
        
        if (response.errcode > 0) {
            throw response.errmsg;
        }
        return response;
    } catch (_error) {
        err = _error;
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with userInfoGet. " + err), {
            response: err
        });
    }
};

exports.userGet = async function (access_token, userid) {
    var err, response;
    try {
        response = await fetch("https://oapi.dingtalk.com/user/get?access_token=" + access_token + "&userid=" + userid).then(res => res.json());
        
        if (response.errcode > 0) {
            throw response.errmsg;
        }
        return response;
    } catch (_error) {
        err = _error;
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with userGet. " + err), {
            response: err
        });
    }
};

exports.userGetByMobile = async function (access_token, mobile) {
    var err, response;
    try {
        response = await fetch("https://oapi.dingtalk.com/topapi/v2/user/getbymobile?access_token=" + access_token, {
            method: 'post',
            body: JSON.stringify({
                "mobile": mobile
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
        
        if (response.errcode > 0) {
            throw response.errmsg;
        }
        return response;
    } catch (_error) {
        err = _error;
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with userGetByMobile. " + err), {
            response: err
        });
    }
};

exports.spaceGet = async function(corpId){
    try {
        let space = "";
        let spaceId = process.env.STEEDOS_CLOUD_SPACE_ID;
        if(corpId){
            space = await broker.call('dingtalk.getSpaceByDingtalk', {corpId: corpId});
        }else if (spaceId){
            space = await broker.call('dingtalk.getSpaceById', {spaceId: spaceId});
        }else{
            space = await broker.call('dingtalk.getSpaceTop1', {})
        }
        return space;
    } catch (err) {
        console.error(err);
        throw _.extend(new Error("Failed to get space with error: " + err), {
            response: err
        });
    }
};

exports.spaceUsersGet = async function(corpId){
    try {
        let spaceUsers = [];
        let spaceId = process.env.STEEDOS_CLOUD_SPACE_ID;
        if(corpId){
            spaceUsers = await broker.call('objectql.find', {objectName: 'space_users', query: {filters: [['space', '=', corpId]]}})
        }else if (spaceId){
            spaceUsers = await broker.call('objectql.find', {objectName: 'space_users', query: {filters: [['space', '=', spaceId]]}})
        }
        return spaceUsers;
    } catch (err) {
        console.error(err);
        console.log("Failed to get space with error: " + err);
    }
};

exports.sendMessage = async function(data, access_token){
    try {
        let url = "https://oapi.dingtalk.com/topapi/message/corpconversation/asyncsend_v2";
        if (!url)
            return;
        
        let response = await fetch(url + "?access_token=" + access_token, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
        
        if (response.errcode > 0) {
            throw response.errmsg;
        }
        return response.errmsg;
    } catch (err) {
        console.error(err);
        throw _.extend(new Error("Failed to send message with error: " + err), {
            response: err
        });
    }
}

// 使用消息模版发送工作通知
exports.sendTemplateMessage = async function(data, access_token){
    console.log("====使用消息模版发送工作通知",access_token)
    try {
        let url = "https://oapi.dingtalk.com/topapi/message/corpconversation/sendbytemplate";
        if (!url)
            return;
        
        let response = await fetch(url + "?access_token=" + access_token, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
        
        if (response.errcode > 0) {
            throw response.errmsg;
        }
        return response.errmsg;
    } catch (err) {
        console.error(err);
        throw _.extend(new Error("Failed to send message with error: " + err), {
            response: err
        });
    }
}

