module.exports = {
    handler: async function (doc,userId) {
        const userObj = this.getObject('users')
        const userDoc = {
            "_id":userId,
            "name": doc.name,
            "space": doc.space
        }
        userObj.insert(userDoc)
    }
}