/*
 * @Author: 苏佳豪 sujiahao@steedos.com
 * @Date: 2023-09-21 16:13:33
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-28 11:07:16
 * @Description: 
 */
"use strict";
const path = require('path');
const project = require('../package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
const _ = require('lodash')
const actions = require('./actions/index.js');
const methods = require('./methods/index.js');
const rests = require('./rests/index.js')
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * 软件包服务启动后也需要抛出事件。
 */
module.exports = {
	name: packageName,
	namespace: "steedos",
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
	methods: {
		...methods
	},

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
