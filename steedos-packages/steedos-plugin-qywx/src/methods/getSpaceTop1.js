module.exports = {
    handler: async function (userId) {
        const records = await this.broker.call('objectql.find', {objectName: 'spaces', query: {top: 1}});
        return records.length > 0 ? records[0] : null;
    }
}