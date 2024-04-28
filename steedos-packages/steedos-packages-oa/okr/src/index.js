/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-20 13:27:06
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-28 11:06:45
 * @FilePath: /steedos-ee-gitlab/steedos-packages-oa/okr/src/index.js
 * @Description: 
 */
"use strict";
const path = require('path');
const project = require('../package.json');
const packageName = project.name;

const packageLoader = require('@steedos/service-package-loader');

const triggers = require('./triggers')
const methods = require('./methods')

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
		...triggers,
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
