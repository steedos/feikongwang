/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-09-26 13:14:04
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-28 11:07:10
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/invoice/src/index.js
 * @Description: 
 */
"use strict";
const path = require('path');
const project = require('../package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');

const actions = require('./actions')
const methods = require('./methods')
const consts = require('./consts')
const triggers = require('./triggers')
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
		AK: process.env.STEEDOS_LABS_INVOICE_BAIDU_AK, // 必须参数，应用的API Key
		SK: process.env.STEEDOS_LABS_INVOICE_BAIDU_SK, // 必须参数，应用的Secret Key
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
		const { AK, SK } = this.settings
		if (!AK || !SK) {
			console.log(require('chalk').red(consts.NEED_CONFIG_AK_AND_SK))
		}
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
