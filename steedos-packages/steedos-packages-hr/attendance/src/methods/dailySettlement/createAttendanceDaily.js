//创建每日考勤
module.exports = {
    handler: async function (doc) {
        await this.broker.call('objectql.insert', {
            objectName: 'attendance_daily',
            doc
        })
        
    }
}