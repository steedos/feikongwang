module.exports = {
    handler: async function (spaceId) {
        const spaces = await this.broker.call('objectql.find', {objectName: 'spaces', query: {filters: [["_id", "=", spaceId]]}});
        return spaces.length > 0 ? spaces[0] : null;
    }
}