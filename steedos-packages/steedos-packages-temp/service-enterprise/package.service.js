/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-03-04 17:02:52
 * @LastEditors: 苏佳豪 sujiahao@steedos.com
 * @LastEditTime: 2023-09-19 14:52:00
 * @Description: 
 */
"use strict";
const project = require('./package.json');
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
	},
    metadata: {
        $package: {
            name: project.name,
            version: project.version,
            path: __dirname,
            isPackage: false
        }
    },

	/**
	 * Dependencies
	 */
	dependencies: ['steedos-server', '@steedos-labs/service-community', '@steedos/service-enterprise'],

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
		// console.log(require('chalk').blue('service-enterprise-'.repeat(10)));
		await this.broker.call('@steedos/service-project.addPackages', {
			packages: [
				{
					name: '@steedos-labs/project-ee',
					enable: true
				},
				{
					name: '@steedos-labs/hr',
					enable: true
				},
				{
					name: '@steedos-labs/attendance',
					enable: true
				},
				{
					name: '@steedos-labs/performance',
					enable: true
				},
				{
					name: '@steedos-labs/budget',
					enable: false
				}, 
				{
					name: '@steedos-labs/bidding',
					enable: true
				}, 
				{
					name: '@steedos-labs/workflow',
					enable: false
				}, 
				{
					name: '@steedos-labs/asset',
					enable: true
				}, 
				//  ... ...
			]
		})
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
