module.exports = {
    handler: async function (spaceId,userId) {
        const suDoc = await this.broker.call('objectql.find', {
            objectName: 'space_users',
            query: {
                filters: [
                    ['space', '=', spaceId],
                    ['user', '=', userId]
                ]
            }
        })
        return suDoc[0];
    }
}