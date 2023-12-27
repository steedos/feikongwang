/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-25 10:21:15
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-25 11:36:28
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/crm/src/triggers/accounts_trigger.js
 * @Description: 
 */

const _ = require('lodash')

module.exports = {
    trigger: {
        listenTo: 'accounts',
        when: [
            'beforeUpdate',
            'afterUpdate',
        ],
    },
    async handler(ctx) {
        const { isInsert, isUpdate, isDelete, isFind, isBefore, isAfter, id, doc, previousDoc, size, userId, spaceId, objectName, query, data } = ctx.params;
        if (isBefore) {

            if (isUpdate) {
                if (_.has(doc, 'is_supplier') || _.has(doc, 'is_customer')) {
                    if (userId && spaceId) {
                        const userSession = await this.getUser(userId, spaceId)
                        if (!userSession.is_space_admin) {
                            throw new Error('not permission');
                        }
                    }
                }
            }

        }
        if (isAfter) {

            if (isUpdate) {
                const contactsObj = this.getObject('contacts')
                const suObj = this.getObject('space_users')
                if (doc.is_supplier === false) {
                    var contacts = await contactsObj.find({
                        filters: [
                            ['account', '=', id],
                            ['space', '=', spaceId],
                            ['user', '!=', null]
                        ],
                        fields: ['_id']
                    })
                    var contactIds = _.uniq(_.compact(_.map(contacts, '_id')));
                    var suDocs = await suObj.find({
                        filters: [
                            ['contact_id', 'in', contactIds],
                            ['is_supplier', '=', true],
                            ['space', '=', spaceId],
                        ],
                    })
                    var supplierContactIds = _.uniq(_.compact(_.map(suDocs, 'contact_id')));
                    await contactsObj.updateMany([
                        ['_id', 'in', supplierContactIds]
                    ], {
                        user: null
                    })
                    await suObj.updateMany([
                        ['contact_id', 'in', contactIds],
                        ['is_supplier', '=', true],
                        ['space', '=', spaceId]
                    ], {
                        user_accepted: false,
                        contact_id: null
                    })
                }

                if (doc.is_customer === false) {
                    var contacts = await contactsObj.find({
                        filters: [
                            ['account', '=', id],
                            ['space', '=', spaceId],
                            ['user', '!=', null]
                        ],
                        fields: ['_id']
                    })
                    var contactIds = _.uniq(_.compact(_.map(contacts, '_id')));
                    var suDocs = await suObj.find({
                        filters: [
                            ['contact_id', 'in', contactIds],
                            ['is_customer', '=', true],
                            ['space', '=', spaceId],
                        ],
                    })
                    var customerContactIds = _.uniq(_.compact(_.map(suDocs, 'contact_id')));
                    await contactsObj.updateMany([
                        ['_id', 'in', customerContactIds]
                    ], {
                        user: null
                    })
                    await suObj.updateMany([
                        ['contact_id', 'in', contactIds],
                        ['is_customer', '=', true],
                        ['space', '=', spaceId]
                    ], {
                        user_accepted: false,
                        contact_id: null
                    })
                }
            }

        }
    }
}

/**
 * Creator.Objects['accounts'].triggers = Object.assign({}, {
    "before.update.server.disableSpaceUsers": {
        on: "server",
        when: "before.update",
        todo: function (userId, doc, fieldNames, modifier, options) {
            modifier.$set = modifier.$set || {};
            if (_.has(modifier.$set, 'is_supplier') || _.has(modifier.$set, 'is_customer')) {
                if(!Creator.isSpaceAdmin(doc.space, userId)){
                    throw new Error('not permission');
                }
            }
        }
    },
    "after.update.server.disableSpaceUsers": {
        on: "server",
        when: "after.update",
        todo: function (userId, doc, fieldNames, modifier, options) {
            modifier.$set = modifier.$set || {};
            if (modifier.$set.is_supplier === false) {
                var contacts = Creator.getCollection("contacts").find({account: doc._id, space: doc.space, user: {$exists: true}}, {fields: {_id:1}}).fetch();
                var contactIds = _.uniq(_.compact(_.pluck(contacts, '_id')));
                var supplierContactIds = _.uniq(_.compact(_.pluck(db.space_users.direct.find({contact_id:{$in: contactIds}, is_supplier: true, space: doc.space}).fetch(), 'contact_id')));
                Creator.getCollection("contacts").direct.update({_id:{$in: supplierContactIds}}, {$unset: {user: 1}}, {
                    multi: true
                });
                db.space_users.direct.update({contact_id:{$in: contactIds}, is_supplier: true, space: doc.space}, {$set: {user_accepted: false}, $unset: {contact_id: 1}}, {
                    multi: true
                });
            }

            if (modifier.$set.is_customer === false) {
                var contacts = Creator.getCollection("contacts").find({account: doc._id, space: doc.space, user: {$exists: true}}, {fields: {_id:1}}).fetch();
                var contactIds = _.uniq(_.compact(_.pluck(contacts, '_id')));
                var customerContactIds = _.uniq(_.compact(_.pluck(db.space_users.direct.find({contact_id:{$in: contactIds}, is_customer: true, space: doc.space}).fetch(), 'contact_id')));
                Creator.getCollection("contacts").direct.update({_id:{$in: customerContactIds}}, {$unset: {user: 1}}, {
                    multi: true
                });
                db.space_users.direct.update({contact_id:{$in: contactIds}, is_customer: true, space: doc.space}, {$set: {user_accepted: false}, $unset: {contact_id: 1}}, {
                    multi: true
                });
            }
        }
    }
}, Creator.Objects['accounts'].triggers);
 */