module.exports = {
    // 取出docConverts中oldDoc对应key值为空的字段值集合，即docConverts中值不能覆盖更新oldDoc中已经存在的字段值
    handler(docConverts, oldDoc) {
        let result = {};
        _.each(docConverts, (item, key) => {
            if ((oldDoc[key] === undefined || oldDoc[key] === null || oldDoc[key] === 0) && item !== undefined && item !== null && item !== 0) {
                result[key] = item;
            }
        });
        return result;
    }
}