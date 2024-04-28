var odataInsertDoc = function(object_name, doc, callback) {
    var _object_name, spaceId, url;
    var isAsync = false;

    if (callback)
        isAsync = true;

    _object_name = Creator.formatObjectName(object_name);
    spaceId = Steedos.spaceId();
    if (!spaceId) {
        return;
    }
    if (object_name) {
        url = Steedos.absoluteUrl("/api/v4/" + _object_name);
        return $.ajax({
            type: "post",
            url: url,
            data: JSON.stringify(doc),
            dataType: 'json',
            async: isAsync,
            contentType: "application/json",
            processData: false,
            beforeSend: function(request) {
                request.setRequestHeader('X-User-Id', Meteor.userId());
                request.setRequestHeader('X-Auth-Token', Accounts._storedLoginToken());
                return request.setRequestHeader('X-Space-Id', Steedos.spaceId());
            },
            success: function(data) {
                var result;
                if (callback && typeof callback === "function") {
                    result = data.value[0];
                    return callback(result);
                } else {
                    return data.value[0];
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                var error;
                error = jqXHR.responseJSON.error;
                console.error(error);
                if (error.reason) {
                    if (typeof toastr !== "undefined" && toastr !== null) {
                        if (typeof toastr.error === "function") {
                            toastr.error(TAPi18n.__(error.reason));
                        }
                    }
                } else if (error.message) {
                    if (typeof toastr !== "undefined" && toastr !== null) {
                        if (typeof toastr.error === "function") {
                            toastr.error(TAPi18n.__(error.message));
                        }
                    }
                } else {
                    if (typeof toastr !== "undefined" && toastr !== null) {
                        if (typeof toastr.error === "function") {
                            toastr.error(error);
                        }
                    }
                }
                return callback(false, error);
            }
        });
    }
};

var odataQueryDoc = function(object_name, filter){
    var queryFilters = filter;
    var odataFilter = SteedosFilters.formatFiltersToODataQuery(queryFilters);
    var queryOptions = {
        "$filter": odataFilter
    }

    var result = Creator.odata.query(object_name, queryOptions, true);
    if (result) {
        if (result.length > 0) {
            return result;
        }
    }
}

var findArrayIndex = function(array, findKey, value){
    var order = [];
    if (array.length > 0){
        array.forEach(function(o){
            if(o[findKey] == value){
                order.push(o);
                return order;
            }
        })
    }
    return order;
}

var odataInsertOrder = function(item){
    var value = [];
    var insertOrder = {};
    // 实际入库单
    insertOrder.acceptor = item.acceptor;
    insertOrder.stock_state = "draft";

    // 生成实际入库单
    var insertResult = odataInsertDoc("actual_warehouse_entry", insertOrder);
    value = JSON.parse(insertResult.responseText).value;
    
    return value;
}