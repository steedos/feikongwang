const _ = require('lodash');
const path = require('path');
const project = require('../package.json');
const packageLoader = require('@steedos/service-package-loader');
const rests = require('./rests')
const methods = require('./methods')
const actions = require('./actions')
const packageName = project.name;
module.exports = {
    name: packageName,
    mixins: [packageLoader],
    /**
     * Settings
     */
    settings: {

    },

    metadata: {
        $package: {
            name: project.name,
            path: path.join(__dirname, ".."),
            isPackage: true
        }
    },

    /**
     * Dependencies
     */
    dependencies: [],

    /**
     * Actions
     */
    actions: {
        ...actions,
        ...rests,
    },

    /**
     * Events
     */
    events: {
       
    },

    /**
     * Methods
     */
    methods: methods,

    /**
     * Service created lifecycle event handler
     */
    async created() {

    },

    /**
     * Service started lifecycle event handler
     */
    async started() {

    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};