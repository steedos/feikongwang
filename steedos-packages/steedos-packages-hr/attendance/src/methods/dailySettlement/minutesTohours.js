//分钟转小时
module.exports = {
    handler: async function (Minute) {
        return Minute/60;
    }
}