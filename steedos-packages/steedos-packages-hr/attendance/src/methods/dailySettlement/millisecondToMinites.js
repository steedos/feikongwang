//毫秒转分钟
module.exports = {
    handler: async function (millisecond) {
        return millisecond/60000
    }
}