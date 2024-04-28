/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-11-09 09:15:30
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-11-09 09:18:50
 * @FilePath: /steedos-ee-gitlab/steedos-packages-oa/vehicle/src/index.js
 * @Description: 
 */
"use strict";
const path = require('path');
const project = require('../package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
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
		rest: "/"
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
